-- Migration 004: Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  triggering_startup_id UUID REFERENCES public.startups(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('outbid', 'rank_change')),
  old_rank INT,
  new_rank INT,
  new_leader_bid NUMERIC(12, 2),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for unread notifications lookup
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_unread ON public.notifications (recipient_user_id, is_read) WHERE is_read = false;
