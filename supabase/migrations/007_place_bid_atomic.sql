-- Migration 007: Stored procedure for atomic bid placement with FOR UPDATE row locking
CREATE OR REPLACE FUNCTION public.place_bid_atomic(
  p_startup_id UUID,
  p_target_bid NUMERIC(12, 2),
  p_payment_intent_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_current_leader_id UUID;
  v_current_leader_bid NUMERIC(12, 2);
  v_current_startup_bid NUMERIC(12, 2);
  v_incremental_amount NUMERIC(12, 2);
  v_outbid_owner_id UUID;
  v_outbid_startup_name TEXT;
  v_new_bid_id UUID;
  v_old_rank INT;
BEGIN
  -- 1. Get owner user ID of the bidding startup
  SELECT owner_id, total_bid INTO v_user_id, v_current_startup_bid
  FROM public.startups
  WHERE id = p_startup_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Startup not found';
  END IF;

  -- 2. Lock current leader startup row to prevent race conditions
  SELECT id, total_bid, owner_id, name
  INTO v_current_leader_id, v_current_leader_bid, v_outbid_owner_id, v_outbid_startup_name
  FROM public.startups
  ORDER BY total_bid DESC, updated_at ASC
  LIMIT 1
  FOR UPDATE;

  -- Validate target bid exceeds current leader (if leader is a different startup)
  IF v_current_leader_bid IS NOT NULL AND v_current_leader_id <> p_startup_id THEN
    IF p_target_bid <= v_current_leader_bid THEN
      RAISE EXCEPTION 'Stale Bid: Target bid $ % must exceed current leader bid $ %', 
        p_target_bid, v_current_leader_bid;
    END IF;
  ELSIF v_current_leader_id = p_startup_id THEN
    RAISE EXCEPTION 'Invalid Bid: Startup already holds #1 rank';
  ELSE
    IF p_target_bid < 1.00 THEN
      RAISE EXCEPTION 'Minimum initial bid is $1.00';
    END IF;
  END IF;

  -- 3. Calculate incremental amount
  v_incremental_amount := p_target_bid - v_current_startup_bid;
  IF v_incremental_amount <= 0 THEN
    RAISE EXCEPTION 'Target bid must be greater than current cumulative bid $ %', v_current_startup_bid;
  END IF;

  -- 4. Record confirmed bid
  INSERT INTO public.bids (
    startup_id,
    user_id,
    target_bid,
    incremental_amount,
    paddle_transaction_id,
    status
  ) VALUES (
    p_startup_id,
    v_user_id,
    p_target_bid,
    v_incremental_amount,
    p_payment_intent_id,
    'confirmed'
  ) RETURNING id INTO v_new_bid_id;

  -- 5. Update startup total_bid and updated_at
  UPDATE public.startups
  SET total_bid = p_target_bid,
      updated_at = now()
  WHERE id = p_startup_id;

  -- 6. Notify previous leader if surpassed
  IF v_outbid_owner_id IS NOT NULL AND v_outbid_owner_id <> v_user_id THEN
    INSERT INTO public.notifications (
      recipient_user_id,
      triggering_startup_id,
      type,
      old_rank,
      new_rank,
      new_leader_bid
    ) VALUES (
      v_outbid_owner_id,
      p_startup_id,
      'outbid',
      1,
      2,
      p_target_bid
    );
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'bid_id', v_new_bid_id,
    'startup_id', p_startup_id,
    'target_bid', p_target_bid,
    'incremental_charged', v_incremental_amount,
    'outbid_user_id', v_outbid_owner_id
  );
END;
$$;
