-- Migration 005: Create processed_webhook_events table for Paddle webhook idempotency
CREATE TABLE IF NOT EXISTS public.processed_webhook_events (
  event_id TEXT PRIMARY KEY,
  transaction_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
