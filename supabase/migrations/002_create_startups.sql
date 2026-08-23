-- Migration 002: Create startups table
CREATE TABLE IF NOT EXISTS public.startups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  website_url TEXT,
  total_bid NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (total_bid >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for leaderboard queries and owner lookup
CREATE INDEX IF NOT EXISTS idx_startups_total_bid_desc ON public.startups (total_bid DESC, updated_at ASC);
CREATE INDEX IF NOT EXISTS idx_startups_owner_id ON public.startups (owner_id);
