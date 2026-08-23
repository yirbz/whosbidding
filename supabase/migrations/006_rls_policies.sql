-- Migration 006: Enable RLS and define security policies per data-model.md

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processed_webhook_events ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public can view profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2. Startups Policies
CREATE POLICY "Public can view startups"
  ON public.startups FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create a startup"
  ON public.startups FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their startup profile"
  ON public.startups FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

-- 3. Bids Policies
CREATE POLICY "Public can view confirmed bids"
  ON public.bids FOR SELECT
  USING (status = 'confirmed');

CREATE POLICY "Users can view own bids"
  ON public.bids FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Deny direct client insert on bids"
  ON public.bids FOR INSERT
  WITH CHECK (false);

-- 4. Notifications Policies
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = recipient_user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = recipient_user_id)
  WITH CHECK (auth.uid() = recipient_user_id);

-- 5. Processed Webhook Events Policies (Service Role Only)
-- Default deny all client access; service role bypasses RLS
