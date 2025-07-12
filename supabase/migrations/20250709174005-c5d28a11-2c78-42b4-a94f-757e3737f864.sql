
-- Add a style column to the forms table to store form-level styling
ALTER TABLE public.forms 
ADD COLUMN style jsonb DEFAULT '{}'::jsonb;

-- Update the forms table to ensure existing forms have an empty style object
UPDATE public.forms 
SET style = '{}'::jsonb 
WHERE style IS NULL;
