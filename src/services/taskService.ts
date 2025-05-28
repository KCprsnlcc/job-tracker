import { supabase } from '../lib/supabase';
import { Task, TaskFormData } from '../types';
import { TaskPriority, normalizePriority } from '../types/priority';

/**
 * Get all tasks for a user
 */
export const getTasks = async (userId: string): Promise<Task[]> => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      jobs(company, role)
    `)
    .eq('user_id', userId)
    .order('due_date', { ascending: true });

  if (error) {
    console.error('Error fetching tasks:', error);
    throw new Error(error.message);
  }

  // Transform the response to match our Task interface
  return (data || []).map(item => ({
    ...item,
    priority: normalizePriority(item.priority),
    job_info: item.jobs ? {
      company: item.jobs.company,
      role: item.jobs.role
    } : undefined
  }));
};

/**
 * Get due tasks for a user (today and overdue)
 */
export const getDueTasks = async (userId: string): Promise<Task[]> => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      jobs(company, role)
    `)
    .eq('user_id', userId)
    .eq('completed', false)
    .lte('due_date', today)
    .order('due_date', { ascending: true });

  if (error) {
    console.error('Error fetching due tasks:', error);
    throw new Error(error.message);
  }

  // Transform the response to match our Task interface
  return (data || []).map(item => ({
    ...item,
    priority: normalizePriority(item.priority),
    job_info: item.jobs ? {
      company: item.jobs.company,
      role: item.jobs.role
    } : undefined
  }));
};

/**
 * Create a new task
 */
export const createTask = async (userId: string, taskData: TaskFormData): Promise<Task> => {
  // Ensure the priority is one of the allowed values
  if (!['low', 'medium', 'high'].includes(taskData.priority)) {
    throw new Error('Invalid priority value. Must be low, medium, or high.');
  }
  
  const newTask: any = {
    ...taskData,
    user_id: userId,
    completed: false
  };

  const { data, error } = await supabase
    .from('tasks')
    .insert([newTask])
    .select(`
      *,
      jobs(company, role)
    `)
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw new Error(error.message);
  }

  return {
    ...data,
    priority: normalizePriority(data.priority),
    job_info: data.jobs ? {
      company: data.jobs.company,
      role: data.jobs.role
    } : undefined
  };
};

/**
 * Update an existing task
 */
export const updateTask = async (taskId: string, taskData: Partial<TaskFormData>): Promise<Task> => {
  // If priority is being updated, ensure it's one of the allowed values
  if (taskData.priority && !['low', 'medium', 'high'].includes(taskData.priority)) {
    throw new Error('Invalid priority value. Must be low, medium, or high.');
  }

  const { data, error } = await supabase
    .from('tasks')
    .update(taskData)
    .eq('id', taskId)
    .select(`
      *,
      jobs(company, role)
    `)
    .single();

  if (error) {
    console.error('Error updating task:', error);
    throw new Error(error.message);
  }

  return {
    ...data,
    priority: normalizePriority(data.priority),
    job_info: data.jobs ? {
      company: data.jobs.company,
      role: data.jobs.role
    } : undefined
  };
};

/**
 * Mark a task as complete
 */
export const completeTask = async (taskId: string, completed: boolean): Promise<Task> => {
  const { data, error } = await supabase
    .from('tasks')
    .update({ completed })
    .eq('id', taskId)
    .select(`
      *,
      jobs(company, role)
    `)
    .single();

  if (error) {
    console.error('Error completing task:', error);
    throw new Error(error.message);
  }

  return {
    ...data,
    priority: normalizePriority(data.priority),
    job_info: data.jobs ? {
      company: data.jobs.company,
      role: data.jobs.role
    } : undefined
  };
};

/**
 * Delete a task
 */
export const deleteTask = async (taskId: string): Promise<void> => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    console.error('Error deleting task:', error);
    throw new Error(error.message);
  }
};
