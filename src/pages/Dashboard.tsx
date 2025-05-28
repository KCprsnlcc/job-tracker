import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getJobs, deleteJob } from '../services/jobService';
import { Job, SortField, SortDirection } from '../types';
import JobForm from '../components/JobForm';
import JobTable from '../components/JobTable';
import DeleteConfirmation from '../components/DeleteConfirmation';
import Footer from '../components/Footer';
import { ThemeToggle } from '../components/theme-toggle';
import { Search, Plus, LogOut } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

// Import shadcn components
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('date_applied');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchJobs = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const jobsData = await getJobs(user.id);
      setJobs(jobsData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = () => {
    setCurrentJob(null);
    setIsFormOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setCurrentJob(job);
    setIsFormOpen(true);
  };

  const openDeleteDialog = (jobId: string) => {
    setJobToDelete(jobId);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setJobToDelete(null);
  };

  const handleDeleteJob = async (jobId: string) => {
    openDeleteDialog(jobId);
  };

  const confirmDeleteJob = async () => {
    if (!jobToDelete) return;
    
    try {
      await deleteJob(jobToDelete);
      setJobs(jobs.filter(job => job.id !== jobToDelete));
      closeDeleteDialog();
      toast({
        title: 'Job Deleted',
        description: 'Your job application has been deleted.',
        variant: 'destructive',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to delete job');
      closeDeleteDialog();
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setCurrentJob(null);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setCurrentJob(null);
    fetchJobs();
    toast({
      title: currentJob ? 'Job Updated' : 'Job Added',
      description: currentJob ? 'Your job application has been updated.' : 'Your job application has been added.',
      variant: 'default',
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredJobs = jobs.filter(job => {
    const searchLower = searchTerm.toLowerCase();
    return (
      job.company.toLowerCase().includes(searchLower) ||
      job.role.toLowerCase().includes(searchLower) ||
      job.location.toLowerCase().includes(searchLower) ||
      job.status.toLowerCase().includes(searchLower)
    );
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortField === 'date_applied') {
      const dateA = new Date(a[sortField]).getTime();
      const dateB = new Date(b[sortField]).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else {
      const valueA = a[sortField].toLowerCase();
      const valueB = b[sortField].toLowerCase();
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <img src="/favicon.ico" alt="Job Tracker" className="w-6 h-6" />
            Job Tracker
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => signOut()}
              className="flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl font-semibold">Your Job Applications</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
            </p>
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search jobs..."
                className="pl-8 w-full sm:w-[200px] lg:w-[300px]"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <Button
              onClick={handleAddJob}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Job</span>
            </Button>
          </div>
        </div>

        {error && (
          <Card className="bg-destructive/10 border-destructive p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-destructive">Error</h3>
                <div className="mt-1 text-sm text-destructive/90">{error}</div>
              </div>
            </div>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <JobTable
            jobs={sortedJobs}
            onEdit={handleEditJob}
            onDelete={handleDeleteJob}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
          />
        )}
      </main>

      <JobForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        job={currentJob}
        onSuccess={handleFormSuccess}
      />

      <DeleteConfirmation
        isOpen={deleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDeleteJob}
      />
      
      <Footer />
    </div>
  );
};

export default Dashboard;
