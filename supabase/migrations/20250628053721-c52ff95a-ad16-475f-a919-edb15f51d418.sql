
-- Create forms table to store user forms
CREATE TABLE public.forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  form_fields JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on forms table
ALTER TABLE public.forms ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for forms table
-- Users can view their own forms
CREATE POLICY "Users can view their own forms" 
  ON public.forms 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can create their own forms
CREATE POLICY "Users can create their own forms" 
  ON public.forms 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own forms
CREATE POLICY "Users can update their own forms" 
  ON public.forms 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own forms
CREATE POLICY "Users can delete their own forms" 
  ON public.forms 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at column
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.forms
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
