export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string
          user_id: string
          company: string
          position: string
          date_applied: string
          status: string
          url?: string
          location?: string
          salary_range?: string
          contact_name?: string
          contact_email?: string
          contact_phone?: string
          created_at: string
          updated_at: string
          notes?: string
        }
        Insert: {
          id?: string
          user_id: string
          company: string
          position: string
          date_applied: string
          status: string
          url?: string
          location?: string
          salary_range?: string
          contact_name?: string
          contact_email?: string
          contact_phone?: string
          created_at?: string
          updated_at?: string
          notes?: string
        }
        Update: {
          id?: string
          user_id?: string
          company?: string
          position?: string
          date_applied?: string
          status?: string
          url?: string
          location?: string
          salary_range?: string
          contact_name?: string
          contact_email?: string
          contact_phone?: string
          created_at?: string
          updated_at?: string
          notes?: string
        }
      }
      tasks: {
        Row: {
          id: string
          application_id: string
          description: string
          due_date: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          application_id: string
          description: string
          due_date: string
          status: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          description?: string
          due_date?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name?: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}