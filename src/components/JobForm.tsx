import React, { useState, useEffect } from 'react';
import { Job, JobFormData, JobStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { createJob, updateJob } from '../services/jobService';
import { useForm } from 'react-hook-form';

// Import shadcn components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  onSuccess: () => void;
}

const statusOptions: JobStatus[] = [
  'Applied',
  'Interview',
  'Offer',
  'Rejected',
  'No Response',
];

const JobForm: React.FC<JobFormProps> = ({ isOpen, onClose, job, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<JobStatus>(job?.status as JobStatus || 'Applied');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<JobFormData>({
    defaultValues: {
      company: '',
      role: '',
      date_applied: new Date().toISOString().split('T')[0],
      location: '',
      link: '',
      status: 'Applied',
    },
  });

  useEffect(() => {
    if (job) {
      reset({
        company: job.company,
        role: job.role,
        date_applied: job.date_applied,
        location: job.location,
        link: job.link,
        status: job.status,
      });
      setStatus(job.status);
    } else {
      reset({
        company: '',
        role: '',
        date_applied: new Date().toISOString().split('T')[0],
        location: '',
        link: '',
        status: 'Applied',
      });
      setStatus('Applied');
    }
  }, [job, reset]);

  const onSubmit = async (data: JobFormData) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    // Make sure to include the status value from our select component
    data.status = status;
    
    try {
      if (job && job.id) {
        // Update existing job
        await updateJob(job.id, data);
      } else {
        // Create new job
        await createJob(user.id, data);
      }
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the job application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{job ? 'Edit Job Application' : 'Add New Job Application'}</DialogTitle>
        </DialogHeader>
        
        {error && (
          <Card className="border-destructive bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </Card>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm">
              Company *
            </Label>
            <Input
              id="company"
              placeholder="e.g. Google"
              {...register('company', { required: 'Company is required' })}
              className={errors.company ? 'border-destructive' : ''}
            />
            {errors.company && (
              <p className="text-xs text-destructive">{errors.company.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm">
              Role *
            </Label>
            <Input
              id="role"
              placeholder="e.g. Frontend Developer"
              {...register('role', { required: 'Role is required' })}
              className={errors.role ? 'border-destructive' : ''}
            />
            {errors.role && (
              <p className="text-xs text-destructive">{errors.role.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date_applied" className="text-sm">
              Date Applied *
            </Label>
            <Input
              id="date_applied"
              type="date"
              {...register('date_applied', { required: 'Date applied is required' })}
              className={errors.date_applied ? 'border-destructive' : ''}
            />
            {errors.date_applied && (
              <p className="text-xs text-destructive">{errors.date_applied.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm">
              Location *
            </Label>
            <Input
              id="location"
              placeholder="e.g. Remote, San Francisco, CA"
              {...register('location', { required: 'Location is required' })}
              className={errors.location ? 'border-destructive' : ''}
            />
            {errors.location && (
              <p className="text-xs text-destructive">{errors.location.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="link" className="text-sm">
              Link
            </Label>
            <Input
              id="link"
              placeholder="e.g. https://company.com/jobs/123"
              {...register('link')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status" className="text-sm">
              Status *
            </Label>
            <Select defaultValue={status} onValueChange={(value: string) => setStatus(value as JobStatus)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-xs text-destructive">{errors.status.message}</p>
            )}
          </div>
          
          <DialogFooter className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobForm;
