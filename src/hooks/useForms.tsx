import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface FormFieldStyle {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  fontSize?: string;
  fontFamily?: string;
  padding?: string;
  margin?: string;
  boxShadow?: string;
}

export interface FormTitleStyle {
  fontSize?: string;
  fontFamily?: string;
  textColor?: string;
  margin?: string;
  padding?: string;
}

export interface FormDescriptionStyle {
  fontSize?: string;
  fontFamily?: string;
  textColor?: string;
  margin?: string;
  padding?: string;
}

export interface FormButtonStyle {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  fontSize?: string;
  fontFamily?: string;
  padding?: string;
  margin?: string;
  boxShadow?: string;
}

export interface FormStyle {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  fontSize?: string;
  fontFamily?: string;
  padding?: string;
  boxShadow?: string;
  titleStyle?: FormTitleStyle;
  descriptionStyle?: FormDescriptionStyle;
  buttonStyle?: FormButtonStyle;
}

export interface FormField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  step: number;
  style?: FormFieldStyle;
  labelStyle?: FormFieldStyle;
  showLabel?: boolean;
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  form_fields: FormField[];
  steps?: FormStep[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
  view_count: number;
  submission_count: number;
  style?: FormStyle;
}

export interface Submission {
  id: string;
  form_id: string;
  submitted_at: string;
  data: Record<string, any>;
  viewer_ip?: string | null;
  created_at: string;
}

export interface Analytics {
  views: number;
  submissions: number;
  recentActivity: Array<{
    date: string;
    views: number;
    submissions: number;
  }>;
}

// Helper function to safely parse style from Json to FormStyle
const parseFormStyle = (style: any): FormStyle => {
  if (!style) return {};
  if (typeof style === 'string') {
    try {
      return JSON.parse(style);
    } catch {
      return {};
    }
  }
  return style as FormStyle;
};

export const useForms = () => {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchForms = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedForms = (data || []).map(form => ({
        ...form,
        form_fields: Array.isArray(form.form_fields) ? form.form_fields as unknown as FormField[] : [],
        steps: Array.isArray(form.steps) ? form.steps as unknown as FormStep[] : [],
        style: parseFormStyle(form.style)
      })) as Form[];
      
      setForms(transformedForms);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch forms",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkFormLimit = async (): Promise<{ canCreate: boolean; currentCount: number; isPro: boolean }> => {
    if (!user) return { canCreate: false, currentCount: 0, isPro: false };

    try {
      // Check if user is pro
      const { data: isProData, error: isProError } = await supabase
        .rpc('is_user_pro', { user_uuid: user.id });

      if (isProError) throw isProError;

      // Get current form count
      const { data: formCountData, error: formCountError } = await supabase
        .rpc('get_user_form_count', { user_uuid: user.id });

      if (formCountError) throw formCountError;

      const isPro = isProData || false;
      const currentCount = formCountData || 0;
      const canCreate = isPro || currentCount < 3;

      return { canCreate, currentCount, isPro };
    } catch (error) {
      console.error('Error checking form limit:', error);
      return { canCreate: true, currentCount: 0, isPro: false }; // Fail open
    }
  };

  const createForm = async (title: string, description: string) => {
    if (!user) return null;

    const limitCheck = await checkFormLimit();
    if (!limitCheck.canCreate) {
      return { error: 'FORM_LIMIT_REACHED', currentCount: limitCheck.currentCount };
    }

    try {
      const { data, error } = await supabase
        .from('forms')
        .insert({
          title,
          description,
          form_fields: [],
          steps: [],
          is_public: false,
          user_id: user.id,
          view_count: 0,
          submission_count: 0
        })
        .select()
        .single();

      if (error) throw error;

      await fetchForms();
      return {
        ...data,
        form_fields: Array.isArray(data.form_fields) ? data.form_fields as unknown as FormField[] : [],
        steps: Array.isArray(data.steps) ? data.steps as unknown as FormStep[] : [],
        style: parseFormStyle(data.style)
      } as Form;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to create form",
        variant: "destructive"
      });
      return null;
    }
  };

  const trackFormView = async (formId: string, ipAddress?: string) => {
    try {
      await supabase
        .from('form_analytics')
        .insert({
          form_id: formId,
          event_type: 'view',
          ip_address: ipAddress,
          user_agent: navigator.userAgent
        });
    } catch (error) {
      console.error('Error tracking form view:', error);
    }
  };

  const trackFormSubmission = async (formId: string, ipAddress?: string) => {
    try {
      await supabase
        .from('form_analytics')
        .insert({
          form_id: formId,
          event_type: 'submission',
          ip_address: ipAddress,
          user_agent: navigator.userAgent
        });
    } catch (error) {
      console.error('Error tracking form submission:', error);
    }
  };

  const getFormAnalytics = async (formId: string): Promise<Analytics | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('form_analytics')
        .select('event_type, timestamp')
        .eq('form_id', formId)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      const views = data?.filter(item => item.event_type === 'view').length || 0;
      const submissions = data?.filter(item => item.event_type === 'submission').length || 0;

      // Group by date for recent activity
      const activityMap = new Map<string, { views: number; submissions: number }>();
      
      data?.forEach(item => {
        const date = new Date(item.timestamp).toDateString();
        if (!activityMap.has(date)) {
          activityMap.set(date, { views: 0, submissions: 0 });
        }
        const activity = activityMap.get(date)!;
        if (item.event_type === 'view') activity.views++;
        if (item.event_type === 'submission') activity.submissions++;
      });

      const recentActivity = Array.from(activityMap.entries())
        .map(([date, activity]) => ({ date, ...activity }))
        .slice(0, 7);

      return { views, submissions, recentActivity };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return null;
    }
  };

  const updateForm = async (id: string, updates: Partial<Form>) => {
    if (!user) return false;

    try {
      const dbUpdates: any = { ...updates };
      if (updates.form_fields) {
        dbUpdates.form_fields = updates.form_fields;
      }
      if (updates.steps) {
        dbUpdates.steps = updates.steps;
      }

      const { error } = await supabase
        .from('forms')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      await fetchForms();
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update form",
        variant: "destructive"
      });
      return false;
    }
  };

  const deleteForm = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('forms')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setForms(forms.filter(form => form.id !== id));
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete form",
        variant: "destructive"
      });
      return false;
    }
  };

  const getForm = async (id: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return {
        ...data,
        form_fields: Array.isArray(data.form_fields) ? data.form_fields as unknown as FormField[] : [],
        steps: Array.isArray(data.steps) ? data.steps as unknown as FormStep[] : [],
        style: parseFormStyle(data.style)
      } as Form;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch form",
        variant: "destructive"
      });
      return null;
    }
  };

  const getPublicForm = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('id', id)
        .eq('is_public', true)
        .single();

      if (error) throw error;
      
      // Track the view
      await trackFormView(id);
      
      return {
        ...data,
        form_fields: Array.isArray(data.form_fields) ? data.form_fields as unknown as FormField[] : [],
        steps: Array.isArray(data.steps) ? data.steps as unknown as FormStep[] : [],
        style: parseFormStyle(data.style)
      } as Form;
    } catch (error: any) {
      console.error('Error fetching public form:', error);
      return null;
    }
  };

  const submitForm = async (formId: string, formData: Record<string, any>) => {
    try {
      const { error } = await supabase
        .from('submissions')
        .insert({
          form_id: formId,
          data: formData
        });

      if (error) throw error;

      // Track the submission
      await trackFormSubmission(formId);

      return true;
    } catch (error: any) {
      console.error('Error submitting form:', error);
      return false;
    }
  };

  const getFormSubmissions = async (formId: string) => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('form_id', formId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch submissions",
        variant: "destructive"
      });
      return [];
    }
  };

  useEffect(() => {
    if (user) {
      fetchForms();
    } else {
      setForms([]);
      setLoading(false);
    }
  }, [user]);

  return {
    forms,
    loading,
    checkFormLimit,
    createForm,
    updateForm,
    deleteForm,
    getForm,
    getPublicForm,
    submitForm,
    getFormSubmissions,
    getFormAnalytics,
    trackFormView,
    trackFormSubmission,
    refetch: fetchForms
  };
};
