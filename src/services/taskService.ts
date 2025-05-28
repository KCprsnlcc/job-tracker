import { supabase } from '../lib/supabase';
import { Task, TaskFormData } from '../types';
import { normalizePriority } from '../types/priority';

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
  if (!['low', 'medium', 'high'].includes(taskData.priority.toLowerCase())) {
    throw new Error('Invalid priority value. Must be low, medium, or high.');
  }
  
  // Convert priority to capitalized format to match database constraints (Low, Medium, High)
  // The database constraint expects 'Low', 'Medium', 'High' while our TypeScript types use lowercase
  const capitalizedPriority = taskData.priority.charAt(0).toUpperCase() + taskData.priority.slice(1).toLowerCase();
  
  // Create a clean task object with only the fields the database expects
  const newTask = {
    title: taskData.title,
    description: taskData.description || null,
    due_date: taskData.due_date,
    priority: capitalizedPriority, // Capitalized to match database constraints
    job_id: taskData.job_id || null,
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
  if (taskData.priority && !['low', 'medium', 'high'].includes(taskData.priority.toLowerCase())) {
    throw new Error('Invalid priority value. Must be low, medium, or high.');
  }
  
  // Create a copy of taskData for the database with properly capitalized priority
  const dbTaskData = { ...taskData };
  
  // If priority is being updated, capitalize it to match database constraints
  if (dbTaskData.priority) {
    // Create a properly capitalized priority string for the database
    // The database constraint expects 'Low', 'Medium', 'High'
    // While our TypeScript types use lowercase
    const capitalizedPriority = dbTaskData.priority.charAt(0).toUpperCase() + dbTaskData.priority.slice(1).toLowerCase();
    
    // Use type assertion to handle the priority for database - the actual value is capitalized
    // but we need to maintain type compatibility with our interface
    dbTaskData.priority = capitalizedPriority as 'low' | 'medium' | 'high';
  }

  const { data, error } = await supabase
    .from('tasks')
    .update(dbTaskData)
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
