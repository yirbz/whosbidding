-- Migration 014: Add is_hidden column to startups table for moderation and suppression
ALTER TABLE public.startups ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_startups_is_hidden ON public.startups(is_hidden);

-- Suppress non-bidding platform TurboDocx.com
UPDATE public.startups SET is_hidden = true WHERE lower(handle) = 'turbodocx.com';
