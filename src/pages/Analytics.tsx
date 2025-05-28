import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAnalyticsData, getTimeToResponse } from '../services/analyticsService';
import { AnalyticsData } from '../types';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import Footer from '../components/Footer';
import { ThemeToggle } from '../components/theme-toggle';
import { LogOut, BarChart2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { Link } from 'react-router-dom';

const Analytics: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAnalyticsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchAnalyticsData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await getAnalyticsData(user.id);
      
      // Add average response time if available
      const avgTime = await getTimeToResponse(user.id);
      if (avgTime !== null) {
        data.averageResponseTime = avgTime;
      }
      
      setAnalyticsData(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
      toast({
        title: 'Error',
        description: 'Failed to load analytics data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src="/favicon.ico" alt="Job Tracker" className="w-6 h-6" />
              Job Tracker
            </Link>
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => signOut()}
              className="flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Job Search Analytics
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Insights and trends from your job search
            </p>
          </div>

          <div className="flex space-x-4">
            <Button variant="outline" asChild>
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
            <Button 
              onClick={fetchAnalyticsData}
              disabled={loading}
            >
              Refresh Data
            </Button>
          </div>
        </div>

        {error && (
          <Card className="bg-destructive/10 border-destructive p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-destructive">Error</h3>
                <div className="mt-1 text-sm text-destructive/90">{error}</div>
              </div>
            </div>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : analyticsData && analyticsData.totalApplications > 0 ? (
          <AnalyticsDashboard data={analyticsData} />
        ) : (
          <div className="text-center py-12">
            <BarChart2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No analytics data available</h3>
            <p className="text-muted-foreground mt-2">
              Start adding job applications to see your analytics data.
            </p>
            <Button className="mt-4" asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Analytics;
