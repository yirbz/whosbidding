-- WhosBidding Migration 010: Anonymous Full-Price Bidding Schema (Constitution v3.0.0)

-- 1. Drop obsolete tables if they exist
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Drop existing triggers/functions from legacy auth schema
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Re-create / Update Startups table for handle-based anonymous bidding
DROP TABLE IF EXISTS public.startups CASCADE;

CREATE TABLE public.startups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handle TEXT UNIQUE NOT NULL,
  website_url TEXT,
  total_bid NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (total_bid >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_startups_total_bid_desc ON public.startups (total_bid DESC, updated_at ASC);
CREATE INDEX idx_startups_handle ON public.startups (handle);

-- 4. Re-create / Update Bids table for full-price anonymous bid transactions
DROP TABLE IF EXISTS public.bids CASCADE;

CREATE TABLE public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID REFERENCES public.startups(id) ON DELETE SET NULL,
  handle TEXT NOT NULL,
  target_bid NUMERIC(12, 2) NOT NULL CHECK (target_bid > 0),
  paddle_transaction_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  idempotency_key TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bids_handle ON public.bids (handle);
CREATE INDEX idx_bids_paddle_txn ON public.bids (paddle_transaction_id);

-- 5. Processed Webhook Events for Paddle idempotency
CREATE TABLE IF NOT EXISTS public.processed_webhook_events (
  event_id TEXT PRIMARY KEY,
  transaction_id TEXT,
  event_type TEXT,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Atomic Stored Procedure for Anonymous Full-Price Bid Confirmation
CREATE OR REPLACE FUNCTION public.confirm_bid_atomic(
  p_handle TEXT,
  p_website_url TEXT,
  p_target_bid NUMERIC,
  p_paddle_transaction_id TEXT
) RETURNS JSONB AS $$
DECLARE
  v_startup_id UUID;
  v_current_leader_bid NUMERIC;
  v_bid_id UUID;
BEGIN
  -- Lock current leader row to prevent race conditions
  SELECT total_bid INTO v_current_leader_bid
  FROM public.startups
  ORDER BY total_bid DESC, updated_at ASC
  LIMIT 1
  FOR UPDATE;

  -- Validate target bid exceeds current leader
  IF v_current_leader_bid IS NOT NULL AND p_target_bid <= v_current_leader_bid THEN
    RAISE EXCEPTION 'BID_TOO_LOW: Target bid (%) must exceed current leader bid (%)', p_target_bid, v_current_leader_bid;
  END IF;

  -- Upsert startup (create if handle new, update total_bid if handle exists)
  INSERT INTO public.startups (handle, website_url, total_bid, updated_at)
  VALUES (p_handle, p_website_url, p_target_bid, now())
  ON CONFLICT (handle) DO UPDATE
  SET total_bid = p_target_bid,
      website_url = COALESCE(EXCLUDED.website_url, public.startups.website_url),
      updated_at = now()
  RETURNING id INTO v_startup_id;

  -- Update bid record status to confirmed
  UPDATE public.bids
  SET status = 'confirmed', startup_id = v_startup_id
  WHERE paddle_transaction_id = p_paddle_transaction_id
    AND status = 'pending'
  RETURNING id INTO v_bid_id;

  RETURN jsonb_build_object(
    'startup_id', v_startup_id,
    'bid_id', v_bid_id,
    'new_total_bid', p_target_bid,
    'handle', p_handle
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Enable RLS on startups and bids (public read access)
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public startups read" ON public.startups;
CREATE POLICY "Public startups read" ON public.startups FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public bids read" ON public.bids;
CREATE POLICY "Public bids read" ON public.bids FOR SELECT USING (true);
