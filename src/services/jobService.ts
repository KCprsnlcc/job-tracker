import { supabase } from '../lib/supabase';
import { Job, JobFormData, JobStatus } from '../types';

/**
 * Get all jobs for a user
 */
export const getJobs = async (userId: string): Promise<Job[]> => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('user_id', userId)
    .order('date_applied', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
    throw new Error(error.message);
  }

  return (data || []).map(job => ({
    ...job,
    status: job.status as JobStatus
  }));
};

/**
 * Create a new job application
 */
export const createJob = async (jobData: JobFormData, userId: string): Promise<Job> => {
  const newJob: Omit<Job, 'id' | 'created_at' | 'updated_at'> = {
    ...jobData,
    user_id: userId,
  };

  const { data, error } = await supabase
    .from('jobs')
    .insert([newJob])
    .select()
    .single();

  if (error) {
    console.error('Error creating job:', error);
    throw new Error(error.message);
  }

  return {
    ...data,
    status: data.status as JobStatus
  };
};

/**
 * Update an existing job application
 */
export const updateJob = async (jobId: string, jobData: Partial<JobFormData>): Promise<Job> => {
  const { data, error } = await supabase
    .from('jobs')
    .update(jobData)
    .eq('id', jobId)
    .select()
    .single();

  if (error) {
    console.error('Error updating job:', error);
    throw new Error(error.message);
  }

  return {
    ...data,
    status: data.status as JobStatus
  };
};

/**
 * Delete a job application
 */
export const deleteJob = async (jobId: string): Promise<void> => {
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', jobId);

  if (error) {
    console.error('Error deleting job:', error);
    throw new Error(error.message);
  }
};
