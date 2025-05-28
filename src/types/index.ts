import { TaskPriority } from './priority';

export enum JobStatus {
  APPLIED = 'Applied',
  INTERVIEW = 'Interview',
  OFFER = 'Offer',
  REJECTED = 'Rejected',
  WITHDRAWN = 'Withdrawn',
  NO_RESPONSE = 'No Response'
}

export interface Job {
  id?: string;
  user_id: string;
  company: string;
  role: string;
  date_applied: string;
  location: string;
  link?: string | null;
  status: JobStatus;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface JobFormData {
  company: string;
  role: string;
  date_applied: string;
  location: string;
  link?: string | null;
  status: JobStatus;
  notes?: string | null;
}

export interface Task {
  id?: string;
  user_id: string;
  job_id?: string | null;
  title: string;
  description?: string | null;
  due_date: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  job_info?: {
    company: string;
    role: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  job_id?: string;
}

export interface AnalyticsData {
  totalApplications: number;
  byStatus: Record<JobStatus, number>;
  byCompany: Record<string, number>;
  byMonth: Record<string, number>;
  applicationsByMonth: Record<string, number>;
  responseRate: number;
  interviewRate: number;
  offerRate: number;
  averageResponseTime?: number;
}

export type SortField = 'company' | 'role' | 'date_applied' | 'location' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface Database {
  public: {
    Tables: {
      jobs: {
        Row: Job;
        Insert: Omit<Job, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Job, 'id' | 'created_at' | 'updated_at'>>;
      };
      tasks: {
        Row: Task;
        Insert: Omit<Task, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
