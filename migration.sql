-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create jobs table for tracking job applications
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  date_applied DATE NOT NULL,
  location TEXT,
  link TEXT,
  status TEXT NOT NULL CHECK (status IN ('Applied', 'Screening', 'Interview', 'Technical', 'Offer', 'Rejected', 'Withdrawn')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS (Row Level Security) policies for jobs table
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view their own jobs
CREATE POLICY "Users can view their own jobs" ON jobs
  FOR SELECT USING (auth.uid() = user_id);

-- Only authenticated users can insert their own jobs
CREATE POLICY "Users can insert their own jobs" ON jobs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only authenticated users can update their own jobs
CREATE POLICY "Users can update their own jobs" ON jobs
  FOR UPDATE USING (auth.uid() = user_id);

-- Only authenticated users can delete their own jobs
CREATE POLICY "Users can delete their own jobs" ON jobs
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for jobs table
CREATE INDEX IF NOT EXISTS jobs_user_id_idx ON jobs (user_id);
CREATE INDEX IF NOT EXISTS jobs_company_idx ON jobs (company);
CREATE INDEX IF NOT EXISTS jobs_role_idx ON jobs (role);
CREATE INDEX IF NOT EXISTS jobs_date_applied_idx ON jobs (date_applied);
CREATE INDEX IF NOT EXISTS jobs_status_idx ON jobs (status);

-- Create tasks table for task management feature
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('Low', 'Medium', 'High')),
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS (Row Level Security) policies for tasks table
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view their own tasks
CREATE POLICY "Users can view their own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

-- Only authenticated users can insert their own tasks
CREATE POLICY "Users can insert their own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only authenticated users can update their own tasks
CREATE POLICY "Users can update their own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

-- Only authenticated users can delete their own tasks
CREATE POLICY "Users can delete their own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for tasks table
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON tasks (user_id);
CREATE INDEX IF NOT EXISTS tasks_job_id_idx ON tasks (job_id);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON tasks (due_date);
CREATE INDEX IF NOT EXISTS tasks_completed_idx ON tasks (completed);

-- Add status_history table for analytics tracking
CREATE TABLE IF NOT EXISTS status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS (Row Level Security) policies for status_history table
ALTER TABLE status_history ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view their own status history
CREATE POLICY "Users can view their own status history" ON status_history
  FOR SELECT USING (auth.uid() = user_id);

-- Only authenticated users can insert into their own status history
CREATE POLICY "Users can insert into their own status history" ON status_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for status_history table
CREATE INDEX IF NOT EXISTS status_history_job_id_idx ON status_history (job_id);
CREATE INDEX IF NOT EXISTS status_history_user_id_idx ON status_history (user_id);

-- Create function to track status changes
CREATE OR REPLACE FUNCTION update_job_status_history()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO status_history (job_id, user_id, old_status, new_status)
    VALUES (NEW.id, NEW.user_id, OLD.status, NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to track status changes
DROP TRIGGER IF EXISTS job_status_change_trigger ON jobs;
CREATE TRIGGER job_status_change_trigger
AFTER UPDATE ON jobs
FOR EACH ROW
EXECUTE FUNCTION update_job_status_history();

-- Create job_responses table to track company responses
CREATE TABLE IF NOT EXISTS job_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  response_date TIMESTAMP WITH TIME ZONE NOT NULL,
  response_type TEXT NOT NULL CHECK (response_type IN ('Initial Response', 'Interview Request', 'Rejection', 'Offer', 'Other')),
  response_time_days INTEGER, -- Days between application and response
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS (Row Level Security) policies for job_responses table
ALTER TABLE job_responses ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view their own job responses
CREATE POLICY "Users can view their own job responses" ON job_responses
  FOR SELECT USING (auth.uid() = user_id);

-- Only authenticated users can insert their own job responses
CREATE POLICY "Users can insert their own job responses" ON job_responses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only authenticated users can update their own job responses
CREATE POLICY "Users can update their own job responses" ON job_responses
  FOR UPDATE USING (auth.uid() = user_id);

-- Only authenticated users can delete their own job responses
CREATE POLICY "Users can delete their own job responses" ON job_responses
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for job_responses table
CREATE INDEX IF NOT EXISTS job_responses_job_id_idx ON job_responses (job_id);
CREATE INDEX IF NOT EXISTS job_responses_user_id_idx ON job_responses (user_id);
CREATE INDEX IF NOT EXISTS job_responses_response_date_idx ON job_responses (response_date);
CREATE INDEX IF NOT EXISTS job_responses_response_type_idx ON job_responses (response_type);

-- Create function to calculate response time in days
CREATE OR REPLACE FUNCTION calculate_response_time()
RETURNS TRIGGER AS $$
DECLARE
  applied_date DATE;
BEGIN
  -- Get the date the job was applied
  SELECT date_applied INTO applied_date FROM jobs WHERE id = NEW.job_id;
  
  -- Calculate the response time in days
  NEW.response_time_days := EXTRACT(DAY FROM (NEW.response_date::timestamp - applied_date::timestamp));
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to calculate response time when a response is added
DROP TRIGGER IF EXISTS calculate_response_time_trigger ON job_responses;
CREATE TRIGGER calculate_response_time_trigger
BEFORE INSERT ON job_responses
FOR EACH ROW
EXECUTE FUNCTION calculate_response_time();

-- Create user_analytics table to store pre-calculated analytics
CREATE TABLE IF NOT EXISTS user_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_applications INTEGER DEFAULT 0,
  response_rate NUMERIC(5,2) DEFAULT 0, -- Percentage
  average_response_time NUMERIC(5,2) DEFAULT 0, -- Days
  applications_by_status JSONB, -- JSON with counts by status
  applications_by_month JSONB, -- JSON with counts by month
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS (Row Level Security) policies for user_analytics table
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view their own analytics
CREATE POLICY "Users can view their own analytics" ON user_analytics
  FOR SELECT USING (auth.uid() = user_id);

-- Create function to update user analytics
CREATE OR REPLACE FUNCTION update_user_analytics(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
  total_apps INTEGER;
  total_responses INTEGER;
  avg_response_time NUMERIC(5,2);
  status_counts JSONB;
  monthly_counts JSONB;
BEGIN
  -- Count total applications
  SELECT COUNT(*) INTO total_apps FROM jobs WHERE user_id = user_uuid;
  
  -- Count total responses
  SELECT COUNT(*) INTO total_responses FROM job_responses WHERE user_id = user_uuid;
  
  -- Calculate response rate
  IF total_apps > 0 THEN
    avg_response_time := (SELECT COALESCE(AVG(response_time_days), 0) FROM job_responses WHERE user_id = user_uuid);
  ELSE
    avg_response_time := 0;
  END IF;
  
  -- Get application counts by status
  SELECT jsonb_object_agg(status, count) INTO status_counts
  FROM (
    SELECT status, COUNT(*) as count
    FROM jobs
    WHERE user_id = user_uuid
    GROUP BY status
  ) AS status_data;
  
  -- Get application counts by month
  SELECT jsonb_object_agg(month_year, count) INTO monthly_counts
  FROM (
    SELECT TO_CHAR(date_applied, 'YYYY-MM') as month_year, COUNT(*) as count
    FROM jobs
    WHERE user_id = user_uuid
    GROUP BY TO_CHAR(date_applied, 'YYYY-MM')
    ORDER BY month_year
  ) AS monthly_data;
  
  -- Update or insert analytics record
  INSERT INTO user_analytics (
    user_id, total_applications, response_rate, average_response_time,
    applications_by_status, applications_by_month, last_updated
  )
  VALUES (
    user_uuid, total_apps,
    CASE WHEN total_apps > 0 THEN (total_responses * 100.0 / total_apps) ELSE 0 END,
    avg_response_time, COALESCE(status_counts, '{}'::jsonb),
    COALESCE(monthly_counts, '{}'::jsonb), now()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    total_applications = EXCLUDED.total_applications,
    response_rate = EXCLUDED.response_rate,
    average_response_time = EXCLUDED.average_response_time,
    applications_by_status = EXCLUDED.applications_by_status,
    applications_by_month = EXCLUDED.applications_by_month,
    last_updated = EXCLUDED.last_updated;
  
END;
$$ LANGUAGE plpgsql;

-- Create function triggers to update analytics when jobs or responses change
CREATE OR REPLACE FUNCTION trigger_update_user_analytics()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_user_analytics(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for jobs table
DROP TRIGGER IF EXISTS update_analytics_on_job_change ON jobs;
CREATE TRIGGER update_analytics_on_job_change
AFTER INSERT OR UPDATE OR DELETE ON jobs
FOR EACH ROW
EXECUTE FUNCTION trigger_update_user_analytics();

-- Create triggers for job_responses table
DROP TRIGGER IF EXISTS update_analytics_on_response_change ON job_responses;
CREATE TRIGGER update_analytics_on_response_change
AFTER INSERT OR UPDATE OR DELETE ON job_responses
FOR EACH ROW
EXECUTE FUNCTION trigger_update_user_analytics();

-- Create user settings table for preferences
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  theme TEXT NOT NULL DEFAULT 'light',
  notification_preferences JSONB DEFAULT '{"email":true, "inApp":true}'::jsonb,
  default_job_view TEXT NOT NULL DEFAULT 'list',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS (Row Level Security) policies for user_settings table
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view their own settings
CREATE POLICY "Users can view their own settings" ON user_settings
  FOR SELECT USING (auth.uid() = user_id);

-- Only authenticated users can insert their own settings
CREATE POLICY "Users can insert their own settings" ON user_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Only authenticated users can update their own settings
CREATE POLICY "Users can update their own settings" ON user_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Create user_access_logs table for tracking devices and IP addresses
CREATE TABLE IF NOT EXISTS user_access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address TEXT,
  device_type TEXT,
  device_name TEXT,
  browser TEXT,
  operating_system TEXT,
  user_agent TEXT,
  access_timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS (Row Level Security) policies for user_access_logs table
ALTER TABLE user_access_logs ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view their own access logs
CREATE POLICY "Users can view their own access logs" ON user_access_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Only authenticated users can insert their own access logs
CREATE POLICY "Users can insert their own access logs" ON user_access_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for user_access_logs table
CREATE INDEX IF NOT EXISTS user_access_logs_user_id_idx ON user_access_logs (user_id);
CREATE INDEX IF NOT EXISTS user_access_logs_ip_address_idx ON user_access_logs (ip_address);
CREATE INDEX IF NOT EXISTS user_access_logs_access_timestamp_idx ON user_access_logs (access_timestamp);

-- Create function to add user access log
CREATE OR REPLACE FUNCTION add_user_access_log(
  user_uuid UUID, 
  ip_addr TEXT,
  device_tp TEXT,
  device_nm TEXT,
  browser_nm TEXT,
  os_nm TEXT,
  agent TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_access_logs (
    user_id, 
    ip_address, 
    device_type, 
    device_name, 
    browser, 
    operating_system, 
    user_agent
  )
  VALUES (
    user_uuid, 
    ip_addr, 
    device_tp, 
    device_nm, 
    browser_nm, 
    os_nm, 
    agent
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to handle auth.users sign-in tracking
CREATE OR REPLACE FUNCTION handle_auth_user_signin()
RETURNS TRIGGER AS $$
BEGIN
  -- When a user signs in, their metadata is updated
  IF OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at THEN
    -- Extract device info from user metadata if available
    INSERT INTO user_access_logs (
      user_id,
      ip_address,
      device_type,
      device_name,
      browser,
      operating_system,
      user_agent
    )
    VALUES (
      NEW.id,
      NEW.raw_app_meta_data->>'ip'::TEXT,
      NEW.raw_user_meta_data->>'device_type'::TEXT,
      NEW.raw_user_meta_data->>'device_name'::TEXT,
      NEW.raw_user_meta_data->>'browser'::TEXT,
      NEW.raw_user_meta_data->>'os'::TEXT,
      NEW.raw_user_meta_data->>'user_agent'::TEXT
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on auth.users table to track sign-ins
DROP TRIGGER IF EXISTS user_signin_tracking_trigger ON auth.users;
CREATE TRIGGER user_signin_tracking_trigger
AFTER UPDATE ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_auth_user_signin();

-- Create admin policy for viewing all access logs (for security monitoring)
CREATE POLICY "Admins can view all access logs" ON user_access_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id AND auth.users.is_super_admin = true
    )
  );

-- Create suspicious_logins table for tracking potential security concerns
CREATE TABLE IF NOT EXISTS suspicious_logins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_log_id UUID NOT NULL REFERENCES user_access_logs(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('Low', 'Medium', 'High')),
  reviewed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS (Row Level Security) policies for suspicious_logins table
ALTER TABLE suspicious_logins ENABLE ROW LEVEL SECURITY;

-- Only admins can view suspicious logins
CREATE POLICY "Admins can view suspicious logins" ON suspicious_logins
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id AND auth.users.is_super_admin = true
    )
  );

-- Create function to detect suspicious logins
CREATE OR REPLACE FUNCTION detect_suspicious_login()
RETURNS TRIGGER AS $$
DECLARE
  common_ip BOOLEAN;
  common_device BOOLEAN;
  new_country TEXT;
  prev_country TEXT;
  reason_text TEXT;
  severity_level TEXT;
BEGIN
  -- Check if this IP has been used before by this user
  SELECT EXISTS (
    SELECT 1 FROM user_access_logs 
    WHERE user_id = NEW.user_id 
    AND ip_address = NEW.ip_address
    AND id != NEW.id
  ) INTO common_ip;
  
  -- Check if this device has been used before by this user
  SELECT EXISTS (
    SELECT 1 FROM user_access_logs 
    WHERE user_id = NEW.user_id 
    AND device_name = NEW.device_name
    AND browser = NEW.browser
    AND operating_system = NEW.operating_system
    AND id != NEW.id
  ) INTO common_device;
  
  -- If neither the IP nor device has been seen before, flag as suspicious
  IF NOT common_ip AND NOT common_device THEN
    reason_text := 'New IP address and new device detected';
    severity_level := 'Medium';
    
    INSERT INTO suspicious_logins (user_id, access_log_id, reason, severity)
    VALUES (NEW.user_id, NEW.id, reason_text, severity_level);
  -- If just the IP is new, flag as low severity suspicious
  ELSIF NOT common_ip AND common_device THEN
    reason_text := 'New IP address detected';
    severity_level := 'Low';
    
    INSERT INTO suspicious_logins (user_id, access_log_id, reason, severity)
    VALUES (NEW.user_id, NEW.id, reason_text, severity_level);
  -- If just the device is new, flag as low severity suspicious
  ELSIF common_ip AND NOT common_device THEN
    reason_text := 'New device detected';
    severity_level := 'Low';
    
    INSERT INTO suspicious_logins (user_id, access_log_id, reason, severity)
    VALUES (NEW.user_id, NEW.id, reason_text, severity_level);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to detect suspicious logins
DROP TRIGGER IF EXISTS detect_suspicious_login_trigger ON user_access_logs;
CREATE TRIGGER detect_suspicious_login_trigger
AFTER INSERT ON user_access_logs
FOR EACH ROW
EXECUTE FUNCTION detect_suspicious_login();
