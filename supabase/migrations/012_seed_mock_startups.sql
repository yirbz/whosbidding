-- Seed 3 mock bidding startups for visual preview
INSERT INTO public.startups (id, handle, website_url, total_bid, created_at, updated_at)
VALUES
  ('seed-1', 'bidonmybid.io', 'https://bidonmybid.io', 15005.00, NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),
  ('seed-2', '@startup_bidder', 'https://x.com/startup_bidder', 14028.00, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours'),
  ('seed-3', 'metabidder.com', 'https://metabidder.com', 10000.00, NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours')
ON CONFLICT (id) DO NOTHING;
