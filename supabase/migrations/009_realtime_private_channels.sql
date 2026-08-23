-- Migration 009: RLS Policy for Realtime Private Notification Channels
BEGIN;

-- Enable RLS on realtime.messages
ALTER TABLE IF EXISTS "realtime"."messages" ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to listen to their own user topic (e.g., user:UUID)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'messages' 
    AND schemaname = 'realtime' 
    AND policyname = 'Users receive their own notifications'
  ) THEN
    CREATE POLICY "Users receive their own notifications"
      ON "realtime"."messages"
      FOR SELECT
      TO authenticated
      USING (realtime.topic() = 'user:' || auth.uid()::text);
  END IF;
END $$;

COMMIT;
