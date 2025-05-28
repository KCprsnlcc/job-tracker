import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Job, JobFormData } from '../types';
import { useAuth } from '../context/AuthContext';
import { createJob, updateJob } from '../services/jobService';
import { useForm } from 'react-hook-form';

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
  onSuccess: () => void;
}

const statusOptions = [
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
    } else {
      reset({
        company: '',
        role: '',
        date_applied: new Date().toISOString().split('T')[0],
        location: '',
        link: '',
        status: 'Applied',
      });
    }
  }, [job, reset]);

  const onSubmit = async (data: JobFormData) => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (job && job.id) {
        // Update existing job
        await updateJob(job.id, data);
      } else {
        // Create new job
        await createJob(user.id, data);
      }
      
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the job application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                {job ? 'Edit Job Application' : 'Add New Job Application'}
              </Dialog.Title>
              
              <div className="mt-4">
                {error && (
                  <div className="mb-4 p-2 bg-red-50 text-red-700 text-sm rounded">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                      Company *
                    </label>
                    <input
                      type="text"
                      id="company"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.company ? 'border-red-300' : ''
                      }`}
                      placeholder="e.g. Google"
                      {...register('company', { required: 'Company is required' })}
                    />
                    {errors.company && (
                      <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Role *
                    </label>
                    <input
                      type="text"
                      id="role"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.role ? 'border-red-300' : ''
                      }`}
                      placeholder="e.g. Frontend Developer"
                      {...register('role', { required: 'Role is required' })}
                    />
                    {errors.role && (
                      <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="date_applied" className="block text-sm font-medium text-gray-700">
                      Date Applied *
                    </label>
                    <input
                      type="date"
                      id="date_applied"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.date_applied ? 'border-red-300' : ''
                      }`}
                      {...register('date_applied', { required: 'Date applied is required' })}
                    />
                    {errors.date_applied && (
                      <p className="mt-1 text-sm text-red-600">{errors.date_applied.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                      Location *
                    </label>
                    <input
                      type="text"
                      id="location"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.location ? 'border-red-300' : ''
                      }`}
                      placeholder="e.g. Remote, San Francisco, CA"
                      {...register('location', { required: 'Location is required' })}
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                      Link
                    </label>
                    <input
                      type="text"
                      id="link"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="e.g. https://company.com/jobs/123"
                      {...register('link')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status *
                    </label>
                    <select
                      id="status"
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                        errors.status ? 'border-red-300' : ''
                      }`}
                      {...register('status', { required: 'Status is required' })}
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {errors.status && (
                      <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default JobForm;
