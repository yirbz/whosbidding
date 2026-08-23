-- WhosBidding Migration 013: Fix confirm_bid_atomic to allow any valid rank placement bid >= $1.00

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

  -- Upsert startup (create if handle new, update total_bid if handle exists)
  INSERT INTO public.startups (handle, website_url, total_bid, updated_at)
  VALUES (trim(p_handle), p_website_url, p_target_bid, now())
  ON CONFLICT (handle) DO UPDATE
  SET total_bid = p_target_bid,
      website_url = COALESCE(EXCLUDED.website_url, public.startups.website_url),
      updated_at = now()
  RETURNING id INTO v_startup_id;

  -- Update bid record status to confirmed and link startup_id
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
