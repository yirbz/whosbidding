-- Create site analytics table for tracking real total visitors since launch
CREATE TABLE IF NOT EXISTS public.site_analytics (
  id TEXT PRIMARY KEY DEFAULT 'global',
  total_visitors BIGINT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial row if not exists
INSERT INTO public.site_analytics (id, total_visitors)
VALUES ('global', 0)
ON CONFLICT (id) DO NOTHING;

-- Create atomic stored procedure to record visit and return new total
CREATE OR REPLACE FUNCTION public.increment_site_visitors()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count BIGINT;
BEGIN
  UPDATE public.site_analytics
  SET total_visitors = total_visitors + 1,
      updated_at = NOW()
  WHERE id = 'global'
  RETURNING total_visitors INTO new_count;

  IF new_count IS NULL THEN
    INSERT INTO public.site_analytics (id, total_visitors)
    VALUES ('global', 1)
    RETURNING total_visitors INTO new_count;
  END IF;

  RETURN new_count;
END;
$$;
