import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Download, ExternalLink, Copy } from 'lucide-react';
import { useForms, Submission } from '@/hooks/useForms';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const FormSubmissions = () => {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getForm, getFormSubmissions } = useForms();
  
  const [form, setForm] = useState<any>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const loadData = async () => {
      if (!formId) return;

      const [formData, submissionsData] = await Promise.all([
        getForm(formId),
        getFormSubmissions(formId)
      ]);

      if (!formData) {
        toast({
          title: "Form not found",
          description: "This form does not exist or you don't have access to it.",
          variant: "destructive"
        });
        navigate('/dashboard');
        return;
      }

      setForm(formData);
      // Cast the data property and viewer_ip to match our Submission interface
      const typedSubmissions = submissionsData.map(submission => ({
        ...submission,
        data: submission.data as Record<string, any>,
        viewer_ip: submission.viewer_ip as string | null
      }));
      setSubmissions(typedSubmissions);
      setLoading(false);
    };

    loadData();
  }, [formId, user, getForm, getFormSubmissions, navigate]);

  const copyPublicLink = () => {
    const publicUrl = `${window.location.origin}/f/${formId}`;
    navigator.clipboard.writeText(publicUrl);
    toast({
      title: "Link copied!",
      description: "The public form link has been copied to your clipboard.",
    });
  };

  const openPublicForm = () => {
    const publicUrl = `${window.location.origin}/f/${formId}`;
    window.open(publicUrl, '_blank');
  };

  const downloadCSV = () => {
    if (!form || submissions.length === 0) return;

    // Create CSV headers
    const headers = ['Submission Date', ...form.form_fields.map((field: any) => field.label)];
    
    // Create CSV rows
    const rows = submissions.map(submission => {
      const row = [new Date(submission.submitted_at).toLocaleString()];
      form.form_fields.forEach((field: any) => {
        const value = submission.data[field.id];
        if (Array.isArray(value)) {
          row.push(value.join(', '));
        } else {
          row.push(value || '');
        }
      });
      return row;
    });

    // Convert to CSV
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.title}_submissions.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h2>
          <p className="text-gray-600">This form does not exist or you don't have access to it.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              {form.is_public && (
                <>
                  <Button variant="outline" onClick={copyPublicLink}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button variant="outline" onClick={openPublicForm}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Public Form
                  </Button>
                </>
              )}
              {submissions.length > 0 && (
                <Button onClick={downloadCSV} className="bg-green-600 hover:bg-green-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>
            <Badge variant={form.is_public ? "default" : "secondary"}>
              {form.is_public ? "Public" : "Private"}
            </Badge>
          </div>
          {form.description && (
            <p className="text-gray-600 mt-2">{form.description}</p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            Total submissions: {submissions.length}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No submissions yet</p>
                {form.is_public && (
                  <Button onClick={openPublicForm} variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Public Form
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Submitted At</TableHead>
                      {form.form_fields.map((field: any) => (
                        <TableHead key={field.id}>{field.label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-mono text-sm">
                          {new Date(submission.submitted_at).toLocaleString()}
                        </TableCell>
                        {form.form_fields.map((field: any) => (
                          <TableCell key={field.id}>
                            {Array.isArray(submission.data[field.id])
                              ? submission.data[field.id].join(', ')
                              : submission.data[field.id] || '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormSubmissions;
