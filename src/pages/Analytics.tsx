import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getAnalyticsData, getTimeToResponse } from '../services/analyticsService';
import { AnalyticsData } from '../types';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import Footer from '../components/Footer';
import { ThemeToggle } from '../components/theme-toggle';
import { LogOut, BarChart2, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const Analytics: React.FC = () => {
  // For scroll-based animations
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 50], [1, 0.9]);
  
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };
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
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.header 
        className="bg-card border-b border-border sticky top-0 z-10"
        style={{ opacity: headerOpacity }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.h1 
            className="text-2xl font-bold flex items-center gap-2"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/dashboard" className="flex items-center gap-2">
              <motion.img 
                src="/favicon.ico" 
                alt="Job Tracker" 
                className="w-6 h-6" 
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, delay: 0.5 }}
              />
              Job Tracker
            </Link>
          </motion.h1>
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.span 
              className="text-sm text-muted-foreground"
              whileHover={{ color: "var(--primary)" }}
              transition={{ duration: 0.2 }}
            >
              {user?.email}
            </motion.span>
            <ThemeToggle />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => signOut()}
                className="flex items-center gap-1 relative overflow-hidden"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
                <motion.div 
                  className="absolute inset-0 bg-primary/10" 
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.header>

      <motion.main 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0"
          variants={itemVariants}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.h2 
              className="text-xl font-semibold flex items-center gap-2"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, 0] }}
                transition={{ 
                  scale: { type: "spring", stiffness: 260, damping: 20 },
                  rotate: { duration: 1.5, ease: "easeInOut", times: [0, 0.5, 1] }
                }}
              >
                <BarChart2 className="h-5 w-5 text-primary" />
              </motion.div>
              Job Search Analytics
            </motion.h2>
            <motion.p 
              className="text-sm text-muted-foreground mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Insights and trends from your job search
            </motion.p>
          </motion.div>

          <motion.div 
            className="flex space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" asChild className="relative overflow-hidden">
                <Link to="/dashboard" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                  <motion.div 
                    className="absolute inset-0 bg-primary/10" 
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={fetchAnalyticsData}
                disabled={loading}
                className="flex items-center gap-2 relative overflow-hidden"
              >
                <motion.div
                  animate={loading ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 1.5, repeat: loading ? Infinity : 0, ease: "linear" }}
                >
                  <RefreshCw className="h-4 w-4" />
                </motion.div>
                Refresh Data
                <motion.div 
                  className="absolute inset-0 bg-white/20" 
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-destructive/10 border-destructive p-4">
                <div className="flex">
                  <motion.div 
                    className="flex-shrink-0"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 0, 360] }}
                    transition={{ duration: 0.5 }}
                  >
                    <svg className="h-5 w-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-destructive">Error</h3>
                    <div className="mt-1 text-sm text-destructive/90">{error}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              className="flex justify-center py-12"
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              ></motion.div>
            </motion.div>
          ) : analyticsData && analyticsData.totalApplications > 0 ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              variants={itemVariants}
            >
              <AnalyticsDashboard data={analyticsData} />
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-12"
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, 0] }}
                transition={{ 
                  scale: { type: "spring", stiffness: 260, damping: 20 },
                  rotate: { duration: 1.5, ease: "easeInOut", times: [0, 0.5, 1] }
                }}
                className="mb-4"
              >
                <BarChart2 className="h-12 w-12 mx-auto text-muted-foreground" />
              </motion.div>
              <motion.h3 
                className="text-lg font-medium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                No analytics data available
              </motion.h3>
              <motion.p 
                className="text-muted-foreground mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Start adding job applications to see your analytics data.
              </motion.p>
              <motion.div 
                className="mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild className="relative overflow-hidden">
                  <Link to="/dashboard" className="flex items-center gap-2">
                    Go to Dashboard
                    <ArrowLeft className="h-4 w-4" />
                    <motion.div 
                      className="absolute inset-0 bg-white/20" 
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>

      <Footer />
    </motion.div>
  );
};

export default Analytics;
