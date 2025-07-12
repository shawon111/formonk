
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Eye, FileText, TrendingUp, Calendar } from 'lucide-react';
import { useForms, Analytics } from '@/hooks/useForms';
import { useSubscription } from '@/hooks/useSubscription';
import ProUpgradeModal from '@/components/pro/ProUpgradeModal';

interface FormAnalyticsProps {
  formId: string;
  formTitle: string;
}

const FormAnalytics = ({ formId, formTitle }: FormAnalyticsProps) => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { getFormAnalytics } = useForms();
  const { isPro } = useSubscription();

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!isPro) {
        setLoading(false);
        return;
      }

      const data = await getFormAnalytics(formId);
      setAnalytics(data);
      setLoading(false);
    };

    loadAnalytics();
  }, [formId, isPro, getFormAnalytics]);

  if (!isPro) {
    return (
      <>
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TrendingUp className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon!</h3>
            <p className="text-gray-600 text-center mb-4">
              Get detailed insights about your form performance with Pro.
            </p>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
            >
              Upgrade to Pro
            </button>
          </CardContent>
        </Card>
        <ProUpgradeModal 
          open={showUpgradeModal} 
          onClose={() => setShowUpgradeModal(false)}
          feature="Form Analytics"
        />
      </>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BarChart className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-gray-600">No analytics data available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{formTitle} - Analytics</h2>
          <p className="text-gray-600">Form performance insights</p>
        </div>
        <Badge variant="default" className="bg-gradient-to-r from-blue-600 to-purple-600">
          Pro Feature
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.views}</div>
            <p className="text-xs text-muted-foreground">
              People who viewed your form
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.submissions}</div>
            <p className="text-xs text-muted-foreground">
              Completed form submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.views > 0 ? Math.round((analytics.submissions / analytics.views) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Views that became submissions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Chart */}
      {analytics.recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Views and submissions over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.recentActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Views"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="submissions" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Submissions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FormAnalytics;
