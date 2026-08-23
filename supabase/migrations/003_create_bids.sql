-- Migration 003: Create bids table
CREATE TABLE IF NOT EXISTS public.bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID NOT NULL REFERENCES public.startups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_bid NUMERIC(12, 2) NOT NULL,
  incremental_amount NUMERIC(12, 2) NOT NULL CHECK (incremental_amount > 0),
  paddle_transaction_id TEXT UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'failed')),
  idempotency_key TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for bid history and webhook lookup
CREATE INDEX IF NOT EXISTS idx_bids_startup_status ON public.bids (startup_id, status);
CREATE INDEX IF NOT EXISTS idx_bids_user_startup ON public.bids (user_id, startup_id);
CREATE INDEX IF NOT EXISTS idx_bids_paddle_txn ON public.bids (paddle_transaction_id);
