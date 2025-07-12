
-- Add pro column to track subscription status
ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS submission_count INTEGER DEFAULT 0;
ALTER TABLE public.forms ADD COLUMN IF NOT EXISTS steps JSONB DEFAULT '[]'::jsonb;

-- Create subscribers table for Pro subscriptions
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create form_analytics table for tracking views and submissions
CREATE TABLE IF NOT EXISTS public.form_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'view' or 'submission'
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_analytics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and create new ones
DROP POLICY IF EXISTS "select_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "update_own_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "insert_subscription" ON public.subscribers;
DROP POLICY IF EXISTS "select_own_analytics" ON public.form_analytics;
DROP POLICY IF EXISTS "insert_analytics" ON public.form_analytics;

-- Create policies for subscribers
CREATE POLICY "select_own_subscription" ON public.subscribers
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "update_own_subscription" ON public.subscribers
FOR UPDATE
USING (true);

CREATE POLICY "insert_subscription" ON public.subscribers
FOR INSERT
WITH CHECK (true);

-- Create policies for form_analytics
CREATE POLICY "select_own_analytics" ON public.form_analytics
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.forms 
    WHERE forms.id = form_analytics.form_id 
    AND forms.user_id = auth.uid()
  )
);

CREATE POLICY "insert_analytics" ON public.form_analytics
FOR INSERT
WITH CHECK (true);

-- Create function to check if user is pro
CREATE OR REPLACE FUNCTION public.is_user_pro(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT subscribed FROM public.subscribers WHERE user_id = user_uuid LIMIT 1),
    false
  );
$$;

-- Create function to get user's form count
CREATE OR REPLACE FUNCTION public.get_user_form_count(user_uuid UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.forms
  WHERE user_id = user_uuid;
$$;

-- Create trigger to update form counts
CREATE OR REPLACE FUNCTION public.update_form_counts()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.event_type = 'view' THEN
      UPDATE public.forms 
      SET view_count = view_count + 1 
      WHERE id = NEW.form_id;
    ELSIF NEW.event_type = 'submission' THEN
      UPDATE public.forms 
      SET submission_count = submission_count + 1 
      WHERE id = NEW.form_id;
    END IF;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trigger_update_form_counts ON public.form_analytics;
CREATE TRIGGER trigger_update_form_counts
  AFTER INSERT ON public.form_analytics
  FOR EACH ROW EXECUTE FUNCTION public.update_form_counts();
