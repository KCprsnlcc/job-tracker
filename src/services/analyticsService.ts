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
    offerRate: 0,
    averageResponseTime: 0 // Default value for average response time
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
      
      // Also populate applicationsByMonth with the same data
      if (!analytics.applicationsByMonth[month]) {
        analytics.applicationsByMonth[month] = 0;
      }
      analytics.applicationsByMonth[month]++;
    }
  });

  // Calculate response rate (interviews, offers, rejections as percentage of total)
  const responses = analytics.byStatus[JobStatus.INTERVIEW] + 
                    analytics.byStatus[JobStatus.OFFER] + 
                    analytics.byStatus[JobStatus.REJECTED];
  
  analytics.responseRate = (responses / analytics.totalApplications) * 100;
  
  // Calculate interview rate
  analytics.interviewRate = (analytics.byStatus[JobStatus.INTERVIEW] / analytics.totalApplications) * 100;
  
  // Calculate offer rate
  analytics.offerRate = (analytics.byStatus[JobStatus.OFFER] / analytics.totalApplications) * 100;

  // Get all tasks for the user to calculate task metrics
  const { data: tasksData, error: tasksError } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId);

  if (tasksError) {
    console.error('Error fetching tasks for analytics:', tasksError);
    // Don't throw here, just return job analytics without task data
  } else if (tasksData && tasksData.length > 0) {
    // Calculate task metrics
    analytics.totalTasks = tasksData.length;
    
    // Initialize task status categories
    analytics.tasksByStatus = {
      'Completed': 0,
      'Pending': 0
    };
    
    // Initialize task priority categories
    analytics.tasksByPriority = {
      'low': 0,
      'medium': 0,
      'high': 0
    };
    
    // Count tasks by status and priority
    tasksData.forEach((task) => {
      // By status (completed or pending)
      if (analytics.tasksByStatus) {
        if (task.completed) {
          analytics.tasksByStatus['Completed']++;
        } else {
          analytics.tasksByStatus['Pending']++;
        }
      }
      
      // By priority - ensure it's one of our expected values
      if (analytics.tasksByPriority && ['low', 'medium', 'high'].includes(task.priority)) {
        // Cast to valid priority type
        const priority = task.priority as 'low' | 'medium' | 'high';
        analytics.tasksByPriority[priority]++;
      }
    });
    
    // Calculate upcoming tasks (due in the next 7 days)
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    analytics.upcomingTasksDue = tasksData.filter((task) => {
      if (!task.completed && task.due_date) {
        const dueDate = new Date(task.due_date);
        return dueDate >= today && dueDate <= nextWeek;
      }
      return false;
    }).length;
  }

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
