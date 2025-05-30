import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getJobs, deleteJob } from '../services/jobService';
import { Job, SortField, SortDirection } from '../types';
import JobForm from '../components/JobForm';
import JobTable from '../components/JobTable';
import DeleteConfirmation from '../components/DeleteConfirmation';
import ExportDialog from '../components/ExportDialog';
import Footer from '../components/Footer';
import { ThemeToggle } from '../components/theme-toggle';
import { Search, Plus, LogOut, BarChart2, CheckSquare, ArrowRight, Download, Filter, Menu, X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

// Import shadcn components
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Link } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '../components/ui/sheet';

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
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const filteredJobs = jobs.filter(job => {
    // Filter by search term
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = job.company.toLowerCase().includes(searchLower) ||
      job.role.toLowerCase().includes(searchLower) ||
      job.location.toLowerCase().includes(searchLower) ||
      job.status.toLowerCase().includes(searchLower);
    
    // Filter by status
    const matchesStatus = 
      statusFilter === 'all' ||
      job.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
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

  // For scroll-based animations
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 50], [1, 0.9]);
  
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  // Mobile menu items for side drawer
  const MobileMenuItem = ({ icon, label, onClick, to, highlight = false }: any) => (
    <motion.div
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.95 }}
      className="w-full"
    >
      {to ? (
        <Link
          to={to}
          className={`flex items-center gap-3 py-3 px-4 rounded-md hover:bg-muted ${highlight ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
        >
          {icon}
          <span>{label}</span>
        </Link>
      ) : (
        <button
          onClick={onClick}
          className={`flex items-center gap-3 py-3 px-4 rounded-md hover:bg-muted w-full text-left ${highlight ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}`}
        >
          {icon}
          <span>{label}</span>
        </button>
      )}
    </motion.div>
  );

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.header 
        className="bg-card border-b border-border sticky top-0 z-50"
        style={{ opacity: headerOpacity }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.h1 
            className="text-xl sm:text-2xl font-bold flex items-center gap-2 text-primary"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <motion.img 
                src="/favicon.ico" 
                alt="Job Tracker" 
                className="w-5 h-5 sm:w-6 sm:h-6" 
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: 0, ease: "easeInOut" }}
              />
              <span className="hidden sm:inline">Job Tracker</span>
              <span className="sm:hidden">Job Tracker</span>
            </Link>
          </motion.h1>
          
          {/* Desktop Navigation */}
          <motion.div 
            className="hidden md:flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.span 
              className="text-sm text-muted-foreground"
              whileHover={{ color: "var(--primary)" }}
              transition={{ duration: 0.2 }}
            >
              {user?.email}
            </motion.span>
            <ThemeToggle />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  console.log('Dashboard: Sign out button clicked');
                  signOut();
                }}
                className="flex items-center gap-1 relative overflow-hidden"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
                <motion.div 
                  className="absolute inset-0 bg-primary/10" 
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </Button>
            </motion.div>
          </motion.div>
          
          {/* Mobile Menu Button */}
          <motion.div 
            className="md:hidden flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] max-w-sm">
                <SheetHeader className="mb-6">
                  <SheetTitle className="flex items-center gap-2">
                    <img src="/favicon.ico" alt="Job Tracker" className="w-6 h-6" />
                    Job Tracker
                  </SheetTitle>
                  <SheetDescription className="text-sm">
                    {user?.email}
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-1">
                  <MobileMenuItem 
                    icon={<BarChart2 className="h-4 w-4" />} 
                    label="Analytics" 
                    to="/analytics" 
                  />
                  <MobileMenuItem 
                    icon={<CheckSquare className="h-4 w-4" />} 
                    label="Tasks" 
                    to="/tasks" 
                  />
                  <MobileMenuItem 
                    icon={<Plus className="h-4 w-4" />} 
                    label="Add Job" 
                    onClick={() => {
                      handleAddJob();
                      // Close the sheet
                      (document.querySelector('[data-radix-collection-item]') as HTMLElement)?.click();
                    }}
                    highlight
                  />
                  <MobileMenuItem 
                    icon={<Download className="h-4 w-4" />} 
                    label="Export Data" 
                    onClick={() => {
                      setExportDialogOpen(true);
                      // Close the sheet
                      (document.querySelector('[data-radix-collection-item]') as HTMLElement)?.click();
                    }}
                  />
                  <div className="my-2 border-t border-border"></div>
                  <MobileMenuItem 
                    icon={<LogOut className="h-4 w-4" />} 
                    label="Sign Out" 
                    onClick={signOut}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </motion.div>
        </div>
      </motion.header>

      <motion.main 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="flex flex-col mb-6 space-y-4"
          variants={itemVariants}
        >
          <motion.div className="flex justify-between items-center">
            <motion.h2 
              className="text-xl font-semibold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Your Job Applications
            </motion.h2>
            
            {/* Desktop Add Job Button */}
            <motion.div
              className="hidden sm:block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                onClick={handleAddJob}
                className="flex items-center gap-1 relative overflow-hidden"
              >
                <Plus className="h-4 w-4" />
                <span>Add Job</span>
                <motion.div 
                  className="absolute inset-0 bg-white/20" 
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </Button>
            </motion.div>
            
            {/* Mobile Add Button - Fixed Position */}
            <motion.div
              className="sm:hidden fixed bottom-6 right-6 z-10 shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <Button
                onClick={handleAddJob}
                size="icon"
                className="h-14 w-14 rounded-full"
              >
                <Plus className="h-6 w-6" />
                <span className="sr-only">Add Job</span>
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.p 
            className="text-sm text-muted-foreground -mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
          </motion.p>

          {/* Search and Filters - Responsive Design */}
          <motion.div 
            className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div 
              className="relative flex-grow max-w-full sm:max-w-[300px]"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search jobs..."
                className="pl-8 w-full transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                value={searchTerm}
                onChange={handleSearch}
              />
            </motion.div>

            <motion.div 
              className="relative flex items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Select
                value={statusFilter}
                onValueChange={handleFilterChange}
              >
                <SelectTrigger className="w-full sm:w-[160px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="offer">Offer</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
            
            {/* Desktop Export Button */}
            <motion.div
              className="hidden sm:block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                onClick={() => setExportDialogOpen(true)}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-destructive/10 border-destructive p-4">
                <div className="flex">
                  <motion.div 
                    className="flex-shrink-0"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 0, 360] }}
                    transition={{ duration: 0.5 }}
                  >
                    <svg className="h-5 w-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-destructive">Error</h3>
                    <div className="mt-1 text-sm text-destructive/90">{error}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feature Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          variants={itemVariants}
        >
          {/* Analytics Card */}
          <motion.div
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Card className="overflow-hidden h-full hover:shadow-md transition-all duration-300 border-primary/10">
              <CardHeader className="pb-3 flex flex-row items-center gap-2">
                <motion.div 
                  className="bg-primary/10 p-2 rounded-full"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <BarChart2 className="h-6 w-6 text-primary" />
                </motion.div>
                <div>
                  <CardTitle>Progress Analytics</CardTitle>
                  <CardDescription>Get insights into your job search</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pb-3 text-sm">
                <p>
                  View statistics and trends to understand your job search progress. Track response rates, interview success, and identify patterns in your applications.
                </p>
              </CardContent>
              <CardFooter>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full"
                >
                  <Button asChild className="w-full relative overflow-hidden">
                    <Link to="/analytics" className="flex items-center justify-center gap-2">
                      <BarChart2 className="h-4 w-4" />
                      <span>View Analytics</span>
                      <motion.div 
                        animate={{ x: [0, 5, 0] }} 
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                      <motion.div 
                        className="absolute inset-0 bg-white/20" 
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                      />
                    </Link>
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Task Management Card */}
          <motion.div
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Card className="overflow-hidden h-full hover:shadow-md transition-all duration-300 border-primary/10">
              <CardHeader className="pb-3 flex flex-row items-center gap-2">
                <motion.div 
                  className="bg-primary/10 p-2 rounded-full"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <CheckSquare className="h-6 w-6 text-primary" />
                </motion.div>
                <div>
                  <CardTitle>Task Management</CardTitle>
                  <CardDescription>Never miss important deadlines</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pb-3 text-sm">
                <p>
                  Set reminders for follow-ups, interviews, and application deadlines. Organize tasks by priority and track your progress to stay on top of your job search.
                </p>
              </CardContent>
              <CardFooter>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full"
                >
                  <Button asChild className="w-full relative overflow-hidden">
                    <Link to="/tasks" className="flex items-center justify-center gap-2">
                      <CheckSquare className="h-4 w-4" />
                      <span>Manage Tasks</span>
                      <motion.div 
                        animate={{ x: [0, 5, 0] }} 
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                      <motion.div 
                        className="absolute inset-0 bg-white/20" 
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                      />
                    </Link>
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Export Data Card */}
          <motion.div
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Card className="overflow-hidden h-full hover:shadow-md transition-all duration-300 border-primary/10">
              <CardHeader className="pb-3 flex flex-row items-center gap-2">
                <motion.div 
                  className="bg-primary/10 p-2 rounded-full"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Download className="h-6 w-6 text-primary" />
                </motion.div>
                <div>
                  <CardTitle>Data Export</CardTitle>
                  <CardDescription>Take your data anywhere</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pb-3 text-sm">
                <p>
                  Export your job application data in multiple formats. Filter by date, status, or company and schedule periodic exports to track trends over time.
                </p>
              </CardContent>
              <CardFooter>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full"
                >
                  <Button 
                    className="w-full relative overflow-hidden"
                    onClick={() => setExportDialogOpen(true)}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Download className="h-4 w-4" />
                      <span>Export Data</span>
                      <motion.div 
                        animate={{ y: [0, -5, 0] }} 
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </span>
                    <motion.div 
                      className="absolute inset-0 bg-white/20" 
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              className="flex justify-center py-12"
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              ></motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              variants={itemVariants}
            >
              <motion.div 
                className="mt-8 bg-card hover:shadow-md transition-all duration-300 border-primary/10 rounded-md overflow-hidden"
                variants={itemVariants}
              >
                <JobTable
                  jobs={sortedJobs}
                  onEdit={handleEditJob}
                  onDelete={handleDeleteJob}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>

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
      
      <ExportDialog
        isOpen={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
      />
      
      <Footer />
    </motion.div>
  );
};

export default Dashboard;
