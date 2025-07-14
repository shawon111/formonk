import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Plus, Edit, Trash2, FileText, BarChart3, Eye, Copy, Crown, Settings, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useForms } from '@/hooks/useForms';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from '@/hooks/use-toast';
import ProUpgradeModal from '@/components/pro/ProUpgradeModal';
import FormAnalytics from '@/components/analytics/FormAnalytics';

const Dashboard = () => {
  const navigate = useNavigate();
  const { signOut, loading } = useAuth();
  const { forms, createForm, deleteForm, updateForm, checkFormLimit } = useForms();
  const { isPro, subscriptionTier, openCustomerPortal, checkSubscription } = useSubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [formLimit, setFormLimit] = useState({ canCreate: true, currentCount: 0, isPro: false });
  const [selectedFormAnalytics, setSelectedFormAnalytics] = useState<string | null>(null);

  useEffect(() => {
    const loadFormLimit = async () => {
      const limit = await checkFormLimit();
      setFormLimit(limit);
    };
    loadFormLimit();
  }, [forms, checkFormLimit]);

  // Check for successful subscription on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      toast({
        title: "Welcome to Pro! 🎉",
        description: "Your subscription is now active. Enjoy unlimited forms and premium features!",
      });
      checkSubscription();
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [checkSubscription]);

  const handleCreateForm = async () => {
    if (!formLimit.canCreate) {
      setShowUpgradeModal(true);
      return;
    }

    const result = await createForm('Untitled Form', '');
    if (result && 'error' in result && result.error === 'FORM_LIMIT_REACHED') {
      setShowUpgradeModal(true);
    } else if (result && 'id' in result) {
      navigate(`/form-builder/${result.id}`);
    }
  };

  const handleEditForm = (formId: string) => {
    navigate(`/form-builder/${formId}`);
  };

  const handleViewSubmissions = (formId: string) => {
    navigate(`/forms/${formId}/submissions`);
  };

  const handleViewAnalytics = (formId: string, formTitle: string) => {
    if (!isPro) {
      setShowUpgradeModal(true);
      return;
    }
    setSelectedFormAnalytics(formId);
  };

  const handleDeleteForm = async (formId: string) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      const success = await deleteForm(formId);
      if (success) {
        toast({
          title: "Form deleted",
          description: "The form has been successfully deleted.",
        });
      }
    }
  };

  const handleTogglePublic = async (formId: string, isPublic: boolean) => {
    const success = await updateForm(formId, { is_public: !isPublic });
    if (success) {
      toast({
        title: isPublic ? "Form made private" : "Form made public",
        description: isPublic
          ? "The form is no longer accessible to the public."
          : "The form is now accessible via public link.",
      });
    }
  };

  const copyPublicLink = (formId: string) => {
    const publicUrl = `${window.location.origin}/f/${formId}`;
    navigator.clipboard.writeText(publicUrl);
    toast({
      title: "Link copied!",
      description: "The public form link has been copied to your clipboard.",
    });
  };

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your forms...</p>
        </div>
      </div>
    );
  }

  if (selectedFormAnalytics) {
    const form = forms.find(f => f.id === selectedFormAnalytics);
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Button variant="ghost" onClick={() => setSelectedFormAnalytics(null)}>
                ← Back to Dashboard
              </Button>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <FormAnalytics formId={selectedFormAnalytics} formTitle={form?.title || 'Form Analytics'} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to='/'>
                <div className="flex items-center space-x-1">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <img src="/formonk-logo.png" alt="formonk logo" />
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Formonk
                  </h1>
                </div>
              </Link>
              {isPro && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                  <Crown className="w-3 h-3 mr-1" />
                  Pro
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleCreateForm} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Form
              </Button>
              {isPro && (
                <Button variant="outline" onClick={openCustomerPortal}>
                  <Settings className="w-4 h-4 mr-2" />
                  Manage Subscription
                </Button>
              )}
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Forms</h2>
              <p className="text-gray-600">Manage and create beautiful forms</p>
            </div>
            {!isPro && (
              <Button
                onClick={() => setShowUpgradeModal(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
            )}
          </div>

          {/* Form Limit Indicator for Free Users */}
          {!isPro && (
            <Card className="mt-4 border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Forms Used</span>
                  <span className="text-sm text-gray-600">{formLimit.currentCount}/3</span>
                </div>
                <Progress value={(formLimit.currentCount / 3) * 100} className="mb-2" />
                <p className="text-sm text-gray-600">
                  {formLimit.currentCount >= 3
                    ? "You've reached the free plan limit. Upgrade to Pro for unlimited forms!"
                    : `${3 - formLimit.currentCount} forms remaining on free plan.`
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {forms.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No forms yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first form</p>
            <Button onClick={handleCreateForm} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Form
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <Card key={form.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{form.title || 'Untitled Form'}</CardTitle>
                      <CardDescription>{form.description || 'No description'}</CardDescription>
                    </div>
                    <Badge variant={form.is_public ? "default" : "secondary"}>
                      {form.is_public ? "Public" : "Private"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{form.form_fields.length} fields</span>
                      <span>Created {new Date(form.created_at).toLocaleDateString()}</span>
                    </div>

                    {/* Pro Features: Analytics Stats */}
                    {isPro && (
                      <div className="flex items-center justify-between text-sm bg-blue-50 p-2 rounded">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 mr-1" />
                            {form.view_count} views
                          </span>
                          <span className="flex items-center">
                            <FileText className="w-3 h-3 mr-1" />
                            {form.submission_count} submissions
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`public-${form.id}`}
                        checked={form.is_public}
                        onCheckedChange={() => handleTogglePublic(form.id, form.is_public)}
                      />
                      <Label htmlFor={`public-${form.id}`} className="text-sm">
                        Public access
                      </Label>
                    </div>

                    {form.is_public && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyPublicLink(form.id)}
                        className="w-full"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Public Link
                      </Button>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditForm(form.id)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewSubmissions(form.id)}
                        className="flex-1"
                      >
                        <BarChart3 className="w-4 h-4 mr-1" />
                        Submissions
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewAnalytics(form.id, form.title)}
                        className="flex-1"
                        title={isPro ? "View Analytics" : "Pro Feature"}
                      >
                        <TrendingUp className={`w-4 h-4 ${!isPro ? 'text-gray-400' : ''}`} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteForm(form.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <ProUpgradeModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
};

export default Dashboard;
