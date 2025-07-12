
-- Add isPublic column to forms table to control public access
ALTER TABLE public.forms 
ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT false;

-- Create submissions table to store form responses
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  viewer_ip INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on submissions table
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for submissions table
-- Form owners can view all submissions for their forms
CREATE POLICY "Form owners can view submissions for their forms" 
  ON public.submissions 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.forms 
      WHERE forms.id = submissions.form_id 
      AND forms.user_id = auth.uid()
    )
  );

-- Anyone can insert submissions for public forms
CREATE POLICY "Anyone can submit to public forms" 
  ON public.submissions 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.forms 
      WHERE forms.id = submissions.form_id 
      AND forms.is_public = true
    )
  );

-- Form owners can delete submissions for their forms
CREATE POLICY "Form owners can delete submissions for their forms" 
  ON public.submissions 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.forms 
      WHERE forms.id = submissions.form_id 
      AND forms.user_id = auth.uid()
    )
  );

-- Create policy to allow public access to public forms (for form viewing)
CREATE POLICY "Anyone can view public forms" 
  ON public.forms 
  FOR SELECT 
  USING (is_public = true OR auth.uid() = user_id);

-- Create index on form_id for better query performance
CREATE INDEX idx_submissions_form_id ON public.submissions(form_id);
CREATE INDEX idx_submissions_submitted_at ON public.submissions(submitted_at DESC);
