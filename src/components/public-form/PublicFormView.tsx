
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForms, Form, FormField } from '@/hooks/useForms';
import { toast } from '@/hooks/use-toast';
import { CheckSquare } from 'lucide-react';

const PublicFormView = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { getPublicForm, submitForm } = useForms();
  
  const [form, setForm] = useState<Form | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadForm = async () => {
      if (!formId) {
        navigate('/');
        return;
      }

      setLoading(true);
      try {
        const formData = await getPublicForm(formId);
        if (!formData) {
          toast({
            title: "Form not found",
            description: "This form is not available or has been made private.",
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        setForm(formData);
      } catch (error) {
        console.error('Error loading form:', error);
        toast({
          title: "Error loading form",
          description: "Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [formId]); // Only depend on formId, not on the functions

  const handleInputChange = useCallback((fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  }, []);

  const handleCheckboxChange = useCallback((fieldId: string, option: string, checked: boolean) => {
    setFormData(prev => {
      const currentValues = prev[fieldId] || [];
      if (checked) {
        return {
          ...prev,
          [fieldId]: [...currentValues, option]
        };
      } else {
        return {
          ...prev,
          [fieldId]: currentValues.filter((val: string) => val !== option)
        };
      }
    });
  }, []);

  const validateForm = useCallback(() => {
    if (!form) return false;

    for (const field of form.form_fields) {
      if (field.required && (!formData[field.id] || formData[field.id] === '')) {
        toast({
          title: "Required field missing",
          description: `Please fill in the "${field.label}" field.`,
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  }, [form, formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !form) return;

    setSubmitting(true);
    try {
      const success = await submitForm(form.id, formData);
      
      if (success) {
        setSubmitted(true);
        toast({
          title: "Form submitted!",
          description: "Thank you for your submission.",
        });
      } else {
        toast({
          title: "Submission failed",
          description: "Please try again later.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  }, [validateForm, form, formData, submitForm]);

  const getFieldStyle = (field: FormField) => {
    const style = field.style || {};
    return {
      backgroundColor: style.backgroundColor || '#ffffff',
      color: style.textColor || '#000000',
      borderColor: style.borderColor || '#e5e7eb',
      borderWidth: style.borderWidth || '1px',
      borderRadius: style.borderRadius || '6px',
      fontSize: style.fontSize || '16px',
      fontFamily: style.fontFamily || 'Inter',
      padding: style.padding || '8px 12px',
      margin: style.margin || '0px',
      boxShadow: style.boxShadow || '0px 1px 3px rgba(0, 0, 0, 0.1)'
    };
  };

  const getLabelStyle = (field: FormField) => {
    const labelStyle = field.labelStyle || {};
    return {
      color: labelStyle.textColor || '#000000',
      fontSize: labelStyle.fontSize || '14px',
      fontFamily: labelStyle.fontFamily || 'Inter'
    };
  };

  const getTitleStyle = () => {
    const titleStyle = form?.style?.titleStyle || {};
    return {
      color: titleStyle.textColor || '#ffffff',
      fontSize: titleStyle.fontSize || '24px',
      fontFamily: titleStyle.fontFamily || 'Inter',
      margin: titleStyle.margin || '0px',
      padding: titleStyle.padding || '0px'
    };
  };

  const getDescriptionStyle = () => {
    const descriptionStyle = form?.style?.descriptionStyle || {};
    return {
      color: descriptionStyle.textColor || '#e3f2fd',
      fontSize: descriptionStyle.fontSize || '16px',
      fontFamily: descriptionStyle.fontFamily || 'Inter',
      margin: descriptionStyle.margin || '0px',
      padding: descriptionStyle.padding || '0px'
    };
  };

  const getButtonStyle = () => {
    const buttonStyle = form?.style?.buttonStyle || {};
    return {
      backgroundColor: buttonStyle.backgroundColor || '#3b82f6',
      color: buttonStyle.textColor || '#ffffff',
      borderColor: buttonStyle.borderColor || '#3b82f6',
      borderWidth: buttonStyle.borderWidth || '1px',
      borderRadius: buttonStyle.borderRadius || '6px',
      fontSize: buttonStyle.fontSize || '16px',
      fontFamily: buttonStyle.fontFamily || 'Inter',
      padding: buttonStyle.padding || '12px 24px',
      margin: buttonStyle.margin || '0px',
      boxShadow: buttonStyle.boxShadow || '0px 2px 4px rgba(0, 0, 0, 0.1)'
    };
  };

  const renderField = useCallback((field: FormField) => {
    const value = formData[field.id] || '';
    const fieldStyle = getFieldStyle(field);

    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            style={fieldStyle}
            className="min-h-[120px] border-2 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
          />
        );

      case 'select':
        return (
          <Select value={value} onValueChange={(val) => handleInputChange(field.id, val)}>
            <SelectTrigger 
              style={fieldStyle}
              className="h-12 border-2 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
            >
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg">
              {field.options?.map((option) => (
                <SelectItem key={option} value={option} className="py-3 px-4 hover:bg-blue-50">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'radio':
        return (
          <RadioGroup value={value} onValueChange={(val) => handleInputChange(field.id, val)} className="space-y-3">
            {field.options?.map((option) => (
              <div key={option} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                <RadioGroupItem value={option} id={`${field.id}-${option}`} className="w-5 h-5 border-2 border-gray-300" />
                <Label htmlFor={`${field.id}-${option}`} className="cursor-pointer flex-1">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'checkbox':
        const selectedValues = formData[field.id] || [];
        return (
          <div className="space-y-3">
            {field.options?.map((option) => (
              <div key={option} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                <Checkbox
                  id={`${field.id}-${option}`}
                  checked={selectedValues.includes(option)}
                  onCheckedChange={(checked) => handleCheckboxChange(field.id, option, !!checked)}
                  className="w-5 h-5 border-2 border-gray-300"
                />
                <Label htmlFor={`${field.id}-${option}`} className="cursor-pointer flex-1">{option}</Label>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            style={fieldStyle}
            className="h-12 border-2 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
          />
        );
    }
  }, [formData, handleInputChange, handleCheckboxChange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
          <p className="text-gray-700 text-lg font-medium">Loading form...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center font-sans">
        <Card className="max-w-md w-full mx-4 shadow-xl border-0">
          <CardContent className="pt-8 pb-8 px-8">
            <div className="text-center">
              <CheckSquare className="w-20 h-20 text-green-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Thank You!</h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">Your form has been submitted successfully.</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="h-12 px-8 text-base font-semibold border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
              >
                Submit Another Response
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center font-sans">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Form Not Found</h2>
          <p className="text-gray-600 text-lg">This form is not available.</p>
        </div>
      </div>
    );
  }

  const formStyle = form.style || {};
  const formContainerStyle = {
    backgroundColor: formStyle.backgroundColor || '#ffffff',
    color: formStyle.textColor || '#000000',
    borderColor: formStyle.borderColor || '#e5e7eb',
    borderWidth: formStyle.borderWidth || '1px',
    borderRadius: formStyle.borderRadius || '8px',
    fontSize: formStyle.fontSize || '16px',
    fontFamily: formStyle.fontFamily || 'Inter',
    padding: formStyle.padding || '32px',
    boxShadow: formStyle.boxShadow || '0px 4px 6px rgba(0, 0, 0, 0.1)'
  };

  const titleStyle = getTitleStyle();
  const descriptionStyle = getDescriptionStyle();
  const buttonStyle = getButtonStyle();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 font-sans">
      <div className="max-w-3xl mx-auto px-6">
        <Card className="shadow-2xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-8 px-8">
            <CardTitle 
              className="text-3xl font-bold leading-tight"
              style={getTitleStyle()}
            >
              {form.title}
            </CardTitle>
            {form.description && (
              <p 
                className="text-blue-100 text-lg mt-3 leading-relaxed"
                style={getDescriptionStyle()}
              >
                {form.description}
              </p>
            )}
          </CardHeader>
          <CardContent style={formContainerStyle} className="border-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {form.form_fields.map((field) => (
                <div key={field.id} className="space-y-3">
                  {field.showLabel !== false && (
                    <Label 
                      className="block font-semibold"
                      style={getLabelStyle(field)}
                    >
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                  )}
                  {renderField(field)}
                </div>
              ))}
              
              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                  style={getButtonStyle()}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Form'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PublicFormView;
