import { supabase } from '../lib/supabase';
import { Job, Task, JobStatus } from '../types';
import { formatDate } from '../lib/utils';
import { normalizePriority } from '../types/priority';

export interface ExportFilter {
  startDate?: string;
  endDate?: string;
  status?: string[];
  company?: string;
  includeNotes?: boolean;
  includeTasks?: boolean;
}

export interface ExportOptions {
  format: 'json' | 'csv' | 'pdf' | 'xml';
  filters: ExportFilter;
  exportName?: string;
}

export interface ScheduledExport {
  id?: string;
  userId: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  lastExported?: string;
  options: ExportOptions;
  destination: 'email' | 'download';
  email?: string;
}

// Get jobs with optional filtering
export const getFilteredJobs = async (userId: string, filters: ExportFilter): Promise<Job[]> => {
  let query = supabase
    .from('jobs')
    .select('*')
    .eq('user_id', userId);

  // Apply date filters if provided
  if (filters.startDate) {
    query = query.gte('date_applied', filters.startDate);
  }
  
  if (filters.endDate) {
    query = query.lte('date_applied', filters.endDate);
  }

  // Apply status filter if provided
  if (filters.status && filters.status.length > 0) {
    query = query.in('status', filters.status);
  }

  // Apply company filter if provided
  if (filters.company) {
    query = query.ilike('company', `%${filters.company}%`);
  }

  const { data, error } = await query.order('date_applied', { ascending: false });
  
  if (error) {
    throw new Error(`Failed to fetch jobs: ${error.message}`);
  }
  
  // Convert the raw database records to Job objects with proper typing
  return (data || []).map(job => ({
    ...job,
    status: job.status as JobStatus // Cast the string status to JobStatus enum
  }));
};

// Get tasks related to jobs if requested
export const getJobTasks = async (jobIds: string[]): Promise<{ [jobId: string]: Task[] }> => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .in('job_id', jobIds);
  
  if (error) {
    throw new Error(`Failed to fetch tasks: ${error.message}`);
  }
  
  const tasksByJobId: { [jobId: string]: Task[] } = {};
  
  (data || []).forEach(task => {
    // Skip tasks with null job_id
    if (task.job_id === null || task.job_id === undefined) {
      return;
    }

    if (!tasksByJobId[task.job_id]) {
      tasksByJobId[task.job_id] = [];
    }
    
    // Normalize the priority to ensure it's one of: 'low', 'medium', 'high'
    const normalizedTask = {
      ...task,
      priority: normalizePriority(task.priority)
    };
    
    tasksByJobId[task.job_id].push(normalizedTask);
  });
  
  return tasksByJobId;
};

// Export to JSON format
export const exportToJSON = async (userId: string, options: ExportOptions): Promise<string> => {
  const jobs = await getFilteredJobs(userId, options.filters);
  
  let exportData: any = { jobs };
  
  // Include tasks if requested
  if (options.filters.includeTasks && jobs.length > 0) {
    const jobIds = jobs.map(job => job.id).filter((id): id is string => id !== undefined);
    const tasks = await getJobTasks(jobIds);
    exportData.tasks = tasks;
  }
  
  return JSON.stringify(exportData, null, 2);
};

// Export to CSV format
export const exportToCSV = async (userId: string, options: ExportOptions): Promise<string> => {
  const jobs = await getFilteredJobs(userId, options.filters);
  
  // Define CSV headers
  let headers = ['ID', 'Company', 'Role', 'Location', 'Status', 'Date Applied', 'URL'];
  
  if (options.filters.includeNotes) {
    headers.push('Notes');
  }
  
  // Convert jobs to CSV rows
  const rows = jobs.map(job => {
    let row = [
      job.id,
      job.company,
      job.role,
      job.location,
      job.status,
      formatDate(job.date_applied),
      job.link || ''
    ];
    
    if (options.filters.includeNotes) {
      row.push(job.notes || '');
    }
    
    return row;
  });
  
  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');
  
  return csvContent;
};

// Export to XML format
export const exportToXML = async (userId: string, options: ExportOptions): Promise<string> => {
  const jobs = await getFilteredJobs(userId, options.filters);
  
  let xml = '<?xml version="1.0" encoding="UTF-8" ?>\n<JobApplications>\n';
  
  // Include tasks if requested
  let tasksByJobId: { [jobId: string]: Task[] } = {};
  if (options.filters.includeTasks && jobs.length > 0) {
    const jobIds = jobs.map(job => job.id).filter((id): id is string => id !== undefined);
    tasksByJobId = await getJobTasks(jobIds);
  }
  
  // Add each job as an XML element
  jobs.forEach(job => {
    xml += '  <Job>\n';
    xml += `    <ID>${job.id}</ID>\n`;
    xml += `    <Company>${escapeXml(job.company)}</Company>\n`;
    xml += `    <Role>${escapeXml(job.role)}</Role>\n`;
    xml += `    <Location>${escapeXml(job.location)}</Location>\n`;
    xml += `    <Status>${escapeXml(job.status)}</Status>\n`;
    xml += `    <DateApplied>${formatDate(job.date_applied)}</DateApplied>\n`;
    
    if (job.link) {
      xml += `    <URL>${escapeXml(job.link)}</URL>\n`;
    }
    
    if (options.filters.includeNotes && job.notes) {
      xml += `    <Notes>${escapeXml(job.notes)}</Notes>\n`;
    }
    
    // Include tasks if requested
    if (options.filters.includeTasks && typeof job.id === 'string' && tasksByJobId[job.id] && tasksByJobId[job.id].length > 0) {
      xml += '    <Tasks>\n';
      tasksByJobId[job.id].forEach(task => {
        xml += '      <Task>\n';
        xml += `        <ID>${task.id}</ID>\n`;
        xml += `        <Title>${escapeXml(task.title)}</Title>\n`;
        xml += `        <Description>${escapeXml(task.description || '')}</Description>\n`;
        xml += `        <DueDate>${task.due_date ? formatDate(task.due_date) : ''}</DueDate>\n`;
        xml += `        <Status>${task.completed ? 'Completed' : 'Pending'}</Status>\n`;
        xml += `        <TaskID>${task.id}</TaskID>\n`;
        xml += '      </Task>\n';
      });
      xml += '    </Tasks>\n';
    }
    
    xml += '  </Job>\n';
  });
  
  xml += '</JobApplications>';
  
  return xml;
};

// Export to PDF format
export const exportToPDF = async (userId: string, options: ExportOptions): Promise<string> => {
  const jobs = await getFilteredJobs(userId, options.filters);
  
  // Include tasks if requested
  let tasksByJobId: { [jobId: string]: Task[] } = {};
  if (options.filters.includeTasks && jobs.length > 0) {
    const jobIds = jobs.map(job => job.id).filter((id): id is string => id !== undefined);
    tasksByJobId = await getJobTasks(jobIds);
  }
  
  // Generate HTML content that could be converted to PDF
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Job Applications Export</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        table { border-collapse: collapse; width: 100%; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .task-table { margin-left: 20px; margin-top: 10px; margin-bottom: 20px; }
        .job-notes { white-space: pre-wrap; margin-top: 10px; }
      </style>
    </head>
    <body>
      <h1>Job Applications Export</h1>
      <p>Generated on: ${new Date().toLocaleDateString()}</p>
  `;
  
  // Add jobs table
  html += `
    <table>
      <tr>
        <th>Company</th>
        <th>Role</th>
        <th>Location</th>
        <th>Status</th>
        <th>Date Applied</th>
        <th>URL</th>
      </tr>
  `;
  
  jobs.forEach(job => {
    html += `
      <tr>
        <td>${job.company}</td>
        <td>${job.role}</td>
        <td>${job.location}</td>
        <td>${job.status}</td>
        <td>${formatDate(job.date_applied)}</td>
        <td>${job.link || ''}</td>
      </tr>
    `;
    
    // Add notes if requested
    if (options.filters.includeNotes && job.notes) {
      html += `
        <tr>
          <td colspan="6">
            <div class="job-notes">
              <strong>Notes:</strong><br>
              ${job.notes.replace(/\n/g, '<br>')}
            </div>
          </td>
        </tr>
      `;
    }
    
    // Add tasks if requested
    if (options.filters.includeTasks && typeof job.id === 'string' && tasksByJobId[job.id] && tasksByJobId[job.id].length > 0) {
      html += `
        <tr>
          <td colspan="6">
            <strong>Tasks:</strong>
            <table class="task-table">
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Priority</th>
              </tr>
      `;
      
      tasksByJobId[job.id].forEach(task => {
        html += `
          <tr>
            <td>${task.title}</td>
            <td>${task.description || ''}</td>
            <td>${task.due_date ? formatDate(task.due_date) : ''}</td>
            <td>${task.completed ? 'Completed' : 'Pending'}</td>
            <td>${task.priority}</td>
          </tr>
        `;
      });
      
      html += `
            </table>
          </td>
        </tr>
      `;
    }
  });
  
  html += `
    </table>
    </body>
    </html>
  `;
  
  return html;
};

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Create a scheduled export
export const createScheduledExport = async (scheduledExport: ScheduledExport): Promise<ScheduledExport> => {
  const { data, error } = await supabase
    .from('scheduled_exports')
    .insert([scheduledExport])
    .select()
    .single();
  
  if (error) {
    throw new Error(`Failed to create scheduled export: ${error.message}`);
  }
  
  return data;
};

// Get scheduled exports for a user
export const getScheduledExports = async (userId: string): Promise<ScheduledExport[]> => {
  const { data, error } = await supabase
    .from('scheduled_exports')
    .select('*')
    .eq('userId', userId);
  
  if (error) {
    throw new Error(`Failed to fetch scheduled exports: ${error.message}`);
  }
  
  return data || [];
};

// Delete a scheduled export
export const deleteScheduledExport = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('scheduled_exports')
    .delete()
    .eq('id', id);
  
  if (error) {
    throw new Error(`Failed to delete scheduled export: ${error.message}`);
  }
};

// Generate a file name for the export
export const generateExportFileName = (options: ExportOptions): string => {
  const date = new Date().toISOString().split('T')[0];
  const name = options.exportName || 'job-applications';
  return `${name}-${date}.${options.format}`;
};

// Helper to download the exported data as a file
export const downloadExport = (data: string, fileName: string, mimeType: string): void => {
  // Create a blob with the data
  const blob = new Blob([data], { type: mimeType });
  
  // Create a link element
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  
  // Append to the document, click it, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Main export function that handles all formats
export const exportData = async (userId: string, options: ExportOptions): Promise<string> => {
  switch (options.format) {
    case 'json':
      return exportToJSON(userId, options);
    case 'csv':
      return exportToCSV(userId, options);
    case 'xml':
      return exportToXML(userId, options);
    case 'pdf':
      return exportToPDF(userId, options);
    default:
      throw new Error(`Unsupported export format: ${options.format}`);
  }
};

// Execute the export and trigger download
export const executeExport = async (userId: string, options: ExportOptions): Promise<void> => {
  const data = await exportData(userId, options);
  const fileName = generateExportFileName(options);
  
  let mimeType: string;
  switch (options.format) {
    case 'json':
      mimeType = 'application/json';
      break;
    case 'csv':
      mimeType = 'text/csv';
      break;
    case 'xml':
      mimeType = 'application/xml';
      break;
    case 'pdf':
      mimeType = 'application/pdf';
      break;
    default:
      mimeType = 'text/plain';
  }
  
  downloadExport(data, fileName, mimeType);
};
