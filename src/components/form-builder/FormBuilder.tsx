
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useForms, FormField, FormStyle } from '@/hooks/useForms';
import { toast } from '@/hooks/use-toast';
import ElementorFormBuilder from './ElementorFormBuilder';

interface FormData {
  title: string;
  description: string;
  form_fields: FormField[];
  is_public: boolean;
}

const FormBuilder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { updateForm, getForm } = useForms();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    form_fields: [],
    is_public: false
  });

  const [formStyle, setFormStyle] = useState<FormStyle>({
    backgroundColor: '#ffffff',
    textColor: '#000000',
    borderColor: '#e5e7eb',
    borderWidth: '1px',
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'Inter',
    padding: '32px'
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    if (isEditing && id) {
      loadForm();
    }
  }, [isEditing, id, user]);

  const loadForm = async () => {
    if (!id) return;
    
    setLoading(true);
    const form = await getForm(id);
    
    if (form) {
      setFormData({
        title: form.title,
        description: form.description || '',
        form_fields: form.form_fields || [],
        is_public: form.is_public || false
      });
      
      // Handle the style property safely with fallback
      const defaultStyle = {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        borderColor: '#e5e7eb',
        borderWidth: '1px',
        borderRadius: '8px',
        fontSize: '16px',
        fontFamily: 'Inter',
        padding: '32px'
      };
      
      setFormStyle((form as any).style || defaultStyle);
    } else {
      toast({
        title: "Error",
        description: "Form not found",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  const handleSave = async () => {
    if (!id || !user) return;
    
    setSaving(true);
    const success = await updateForm(id, {
      title: formData.title,
      description: formData.description,
      form_fields: formData.form_fields,
      is_public: formData.is_public,
      style: formStyle
    });
    
    if (success) {
      toast({
        title: "Form saved",
        description: "Your form has been successfully saved.",
      });
    }
    
    setSaving(false);
  };

  const handleFieldsChange = (fields: FormField[]) => {
    setFormData(prev => ({
      ...prev,
      form_fields: fields
    }));
  };

  const handleFormTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title
    }));
  };

  const handleFormDescriptionChange = (description: string) => {
    setFormData(prev => ({
      ...prev,
      description
    }));
  };

  const handleViewForm = () => {
    if (id) {
      window.open(`/form/${id}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form...</p>
        </div>
      </div>
    );
  }

  return (
    <ElementorFormBuilder
      formFields={formData.form_fields}
      onFieldsChange={handleFieldsChange}
      formId={id}
      formTitle={formData.title}
      formDescription={formData.description}
      formStyle={formStyle}
      onFormStyleChange={setFormStyle}
      onFormTitleChange={handleFormTitleChange}
      onFormDescriptionChange={handleFormDescriptionChange}
      onSave={handleSave}
      onViewForm={handleViewForm}
    />
  );
};

export default FormBuilder;
