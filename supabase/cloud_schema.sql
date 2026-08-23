-- ==============================================================================
-- WhosBidding — Complete Cloud Supabase Schema
-- Run this in your Cloud Supabase Dashboard > SQL Editor
-- ==============================================================================

-- 1. Startups Table
CREATE TABLE IF NOT EXISTS public.startups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handle TEXT UNIQUE NOT NULL,
  website_url TEXT,
  total_bid NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (total_bid >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_startups_total_bid_desc ON public.startups (total_bid DESC, updated_at ASC);
CREATE INDEX IF NOT EXISTS idx_startups_handle ON public.startups (handle);

-- 2. Bids Table
CREATE TABLE IF NOT EXISTS public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID REFERENCES public.startups(id) ON DELETE SET NULL,
  handle TEXT NOT NULL,
  target_bid NUMERIC(12, 2) NOT NULL CHECK (target_bid > 0),
  paddle_transaction_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  idempotency_key TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bids_handle ON public.bids (handle);
CREATE INDEX IF NOT EXISTS idx_bids_paddle_txn ON public.bids (paddle_transaction_id);

-- 3. Processed Webhook Events (Idempotency)
CREATE TABLE IF NOT EXISTS public.processed_webhook_events (
  event_id TEXT PRIMARY KEY,
  transaction_id TEXT,
  event_type TEXT,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Site Analytics Table
CREATE TABLE IF NOT EXISTS public.site_analytics (
  id TEXT PRIMARY KEY DEFAULT 'global',
  total_visitors BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.site_analytics (id, total_visitors)
VALUES ('global', 0)
ON CONFLICT (id) DO NOTHING;

-- 5. Stored Procedure: Increment Site Visitors
CREATE OR REPLACE FUNCTION public.increment_site_visitors()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count BIGINT;
BEGIN
  UPDATE public.site_analytics
  SET total_visitors = total_visitors + 1,
      updated_at = NOW()
  WHERE id = 'global'
  RETURNING total_visitors INTO new_count;

  IF new_count IS NULL THEN
    INSERT INTO public.site_analytics (id, total_visitors)
    VALUES ('global', 1)
    RETURNING total_visitors INTO new_count;
  END IF;

  RETURN new_count;
END;
$$;

-- 6. Stored Procedure: Atomic Bid Confirmation
CREATE OR REPLACE FUNCTION public.confirm_bid_atomic(
  p_handle TEXT,
  p_website_url TEXT,
  p_target_bid NUMERIC,
  p_paddle_transaction_id TEXT
) RETURNS JSONB AS $$
DECLARE
  v_startup_id UUID;
  v_bid_id UUID;
BEGIN
  -- Validate target bid is at least $1.00
  IF p_target_bid < 1.00 THEN
    RAISE EXCEPTION 'INVALID_BID: Target bid (%) must be at least $1.00', p_target_bid;
  END IF;

  -- Clean handle
  IF p_handle IS NULL OR trim(p_handle) = '' THEN
    RAISE EXCEPTION 'INVALID_HANDLE: Handle cannot be empty';
  END IF;

  -- Upsert startup
  INSERT INTO public.startups (handle, website_url, total_bid, updated_at)
  VALUES (trim(p_handle), p_website_url, p_target_bid, now())
  ON CONFLICT (handle) DO UPDATE
  SET total_bid = p_target_bid,
      website_url = COALESCE(EXCLUDED.website_url, public.startups.website_url),
      updated_at = now()
  RETURNING id INTO v_startup_id;

  -- Update bid record status to confirmed
  UPDATE public.bids
  SET status = 'confirmed',
      startup_id = v_startup_id
  WHERE paddle_transaction_id = p_paddle_transaction_id
  RETURNING id INTO v_bid_id;

  -- If no pending bid record was matched, insert a confirmed bid record for audit trail
  IF v_bid_id IS NULL THEN
    INSERT INTO public.bids (startup_id, handle, target_bid, paddle_transaction_id, status, created_at)
    VALUES (v_startup_id, trim(p_handle), p_target_bid, p_paddle_transaction_id, 'confirmed', now())
    RETURNING id INTO v_bid_id;
  END IF;

  RETURN jsonb_build_object(
    'startup_id', v_startup_id,
    'bid_id', v_bid_id,
    'new_total_bid', p_target_bid,
    'handle', p_handle
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Row Level Security (RLS) and Permissions
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processed_webhook_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for startups" ON public.startups;
CREATE POLICY "Allow all for startups" ON public.startups FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for bids" ON public.bids;
CREATE POLICY "Allow all for bids" ON public.bids FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for site_analytics" ON public.site_analytics;
CREATE POLICY "Allow all for site_analytics" ON public.site_analytics FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all for processed_webhook_events" ON public.processed_webhook_events;
CREATE POLICY "Allow all for processed_webhook_events" ON public.processed_webhook_events FOR ALL TO public USING (true) WITH CHECK (true);

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
