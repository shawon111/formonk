
-- Insert demo forms into the database
INSERT INTO public.forms (
  id,
  title,
  description,
  form_fields,
  is_public,
  user_id,
  view_count,
  submission_count
) VALUES 
(
  'demo-contact-form',
  'Contact Us',
  'Get in touch with our team. We''d love to hear from you!',
  '[
    {
      "id": "name",
      "label": "Full Name",
      "type": "text",
      "required": true,
      "placeholder": "Enter your full name",
      "step": 1
    },
    {
      "id": "email",
      "label": "Email Address",
      "type": "email",
      "required": true,
      "placeholder": "Enter your email",
      "step": 2
    },
    {
      "id": "subject",
      "label": "Subject",
      "type": "text",
      "required": true,
      "placeholder": "What is this about?",
      "step": 3
    },
    {
      "id": "message",
      "label": "Message",
      "type": "textarea",
      "required": true,
      "placeholder": "Tell us more about your inquiry...",
      "step": 4
    }
  ]'::jsonb,
  true,
  '00000000-0000-0000-0000-000000000000',
  127,
  23
),
(
  'demo-survey-form',
  'Customer Satisfaction Survey',
  'Help us improve our services by sharing your feedback',
  '[
    {
      "id": "rating",
      "label": "How would you rate our service?",
      "type": "radio",
      "required": true,
      "options": ["Excellent", "Good", "Average", "Poor"],
      "step": 1
    },
    {
      "id": "recommend",
      "label": "Would you recommend us to others?",
      "type": "radio",
      "required": true,
      "options": ["Definitely", "Probably", "Not sure", "Probably not", "Definitely not"],
      "step": 2
    },
    {
      "id": "improvements",
      "label": "What areas could we improve?",
      "type": "checkbox",
      "required": false,
      "options": ["Customer Support", "Product Quality", "Pricing", "Delivery Speed", "Website Experience"],
      "step": 3
    },
    {
      "id": "comments",
      "label": "Additional Comments",
      "type": "textarea",
      "required": false,
      "placeholder": "Any other feedback you''d like to share?",
      "step": 4
    }
  ]'::jsonb,
  true,
  '00000000-0000-0000-0000-000000000000',
  89,
  15
),
(
  'demo-registration-form',
  'Event Registration',
  'Register for our upcoming workshop on digital marketing',
  '[
    {
      "id": "fullName",
      "label": "Full Name",
      "type": "text",
      "required": true,
      "placeholder": "Enter your full name",
      "step": 1
    },
    {
      "id": "email",
      "label": "Email",
      "type": "email",
      "required": true,
      "placeholder": "your.email@example.com",
      "step": 2
    },
    {
      "id": "company",
      "label": "Company",
      "type": "text",
      "required": false,
      "placeholder": "Your company name",
      "step": 3
    },
    {
      "id": "experience",
      "label": "Experience Level",
      "type": "select",
      "required": true,
      "options": ["Beginner", "Intermediate", "Advanced", "Expert"],
      "step": 4
    },
    {
      "id": "interests",
      "label": "Areas of Interest",
      "type": "checkbox",
      "required": true,
      "options": ["Social Media Marketing", "Email Marketing", "SEO", "Content Marketing", "PPC Advertising"],
      "step": 5
    },
    {
      "id": "dietary",
      "label": "Dietary Requirements",
      "type": "textarea",
      "required": false,
      "placeholder": "Any dietary restrictions or preferences?",
      "step": 6
    }
  ]'::jsonb,
  true,
  '00000000-0000-0000-0000-000000000000',
  156,
  42
);
