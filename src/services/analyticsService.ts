import { supabase } from '../lib/supabase';
import { AnalyticsData, JobStatus } from '../types';

/**
 * Get analytics data for a user
 */
export const getAnalyticsData = async (userId: string): Promise<AnalyticsData> => {
  // Get all jobs for the user
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching jobs for analytics:', error);
    throw new Error(error.message);
  }

  // Initialize analytics object
  const analytics: AnalyticsData = {
    totalApplications: 0,
    byStatus: {
      [JobStatus.APPLIED]: 0,
      [JobStatus.INTERVIEW]: 0,
      [JobStatus.OFFER]: 0,
      [JobStatus.REJECTED]: 0,
      [JobStatus.WITHDRAWN]: 0,
      [JobStatus.NO_RESPONSE]: 0
    },
    byCompany: {},
    byMonth: {},
    applicationsByMonth: {},
    responseRate: 0,
    interviewRate: 0,
    offerRate: 0
  };

  if (!jobs || jobs.length === 0) {
    return analytics;
  }

  // Calculate total applications
  analytics.totalApplications = jobs.length;

  // Calculate applications by status
  jobs.forEach(job => {
    // By status
    if (job.status) {
      analytics.byStatus[job.status as JobStatus]++;
    }

    // By company
    if (job.company) {
      if (!analytics.byCompany[job.company]) {
        analytics.byCompany[job.company] = 0;
      }
      analytics.byCompany[job.company]++;
    }

    // By month
    if (job.date_applied) {
      const month = new Date(job.date_applied).toLocaleString('default', { month: 'short', year: 'numeric' });
      if (!analytics.byMonth[month]) {
        analytics.byMonth[month] = 0;
      }
      analytics.byMonth[month]++;
    }
  });

  // Calculate response rate (interviews, offers, rejections as percentage of total)
  const responses = analytics.byStatus[JobStatus.INTERVIEW] + 
                    analytics.byStatus[JobStatus.OFFER] + 
                    analytics.byStatus[JobStatus.REJECTED];
  
  analytics.responseRate = (responses / analytics.totalApplications) * 100;

  return analytics;
};

/**
 * Calculate average time to response
 */
export const getTimeToResponse = async (userId: string): Promise<number | null> => {
  const { data: jobs, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', userId)
    .in('status', [JobStatus.INTERVIEW, JobStatus.OFFER, JobStatus.REJECTED]);

  if (error) {
    console.error('Error calculating time to response:', error);
    throw new Error(error.message);
  }

  if (!jobs || jobs.length === 0) {
    return null;
  }

  // Calculate days between application and status change
  let totalDays = 0;
  let count = 0;

  jobs.forEach(job => {
    if (job.date_applied && job.updated_at) {
      const appliedDate = new Date(job.date_applied);
      const updatedDate = new Date(job.updated_at);
      const diffTime = Math.abs(updatedDate.getTime() - appliedDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays > 0) {
        totalDays += diffDays;
        count++;
      }
    }
  });

  return count > 0 ? totalDays / count : null;
};
