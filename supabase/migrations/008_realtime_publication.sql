-- Migration 008: Add tables to Supabase Realtime publication
BEGIN;

-- Enable REPLICA IDENTITY FULL for old/new row diff tracking
ALTER TABLE public.startups REPLICA IDENTITY FULL;
ALTER TABLE public.bids REPLICA IDENTITY FULL;

-- Add startups and bids tables to supabase_realtime publication
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.startups;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bids;
  END IF;
END $$;

COMMIT;
