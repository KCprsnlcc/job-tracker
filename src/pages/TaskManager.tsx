import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasks } from '../services/taskService';
import { Task } from '../types';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import Footer from '../components/Footer';
import { ThemeToggle } from '../components/theme-toggle';
import { LogOut, CheckSquare, Plus, Clock, Filter, Check, ArrowLeft, AlertCircle, Search, Menu, X, ArrowRight, BarChart2, ArrowUpDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Input } from '../components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '../components/ui/sheet';

const TaskManager: React.FC = () => {
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
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('due_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const tasksData = await getTasks(user.id);
      setTasks(tasksData);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = () => {
    setCurrentTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setCurrentTask(null);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setCurrentTask(null);
    fetchTasks();
    toast({
      title: currentTask ? 'Task Updated' : 'Task Added',
      description: currentTask ? 'Your task has been updated.' : 'Your task has been added.',
      variant: 'default',
    });
  };

  const handleFilterChange = (value: string) => {
    setFilterType(value);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredTasks = tasks.filter(task => {
    // Search filtering
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      !searchTerm || 
      task.title.toLowerCase().includes(searchLower) ||
      (task.description && task.description.toLowerCase().includes(searchLower)) ||
      (task.job_info && task.job_info.company.toLowerCase().includes(searchLower)) ||
      (task.job_info && task.job_info.role.toLowerCase().includes(searchLower));
    
    if (!matchesSearch) return false;
    
    // Status filtering
    if (filterType === 'all') return true;
    if (filterType === 'completed') return task.completed;
    if (filterType === 'pending') return !task.completed;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(task.due_date);
    taskDate.setHours(0, 0, 0, 0);
    
    if (filterType === 'today') {
      return !task.completed && taskDate.getTime() === today.getTime();
    }
    
    if (filterType === 'overdue') {
      return !task.completed && taskDate < today;
    }
    
    if (filterType === 'upcoming') {
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);
      return !task.completed && taskDate > today && taskDate <= nextWeek;
    }
    
    return true;
  });

  // Sort the filtered tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortField === 'due_date') {
      const dateA = new Date(a.due_date).getTime();
      const dateB = new Date(b.due_date).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortField === 'priority') {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
      const valueA = priorityOrder[a.priority.toLowerCase() as keyof typeof priorityOrder] || 0;
      const valueB = priorityOrder[b.priority.toLowerCase() as keyof typeof priorityOrder] || 0;
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    } else if (sortField === 'title') {
      const valueA = a.title.toLowerCase();
      const valueB = b.title.toLowerCase();
      if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    } else {
      return 0;
    }
  });

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
                  console.log('TaskManager: Sign out button clicked');
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
              <SheetContent side="right" className="w-[90vw] max-w-md">
                <SheetHeader className="mb-6">
                  <SheetTitle className="flex items-center gap-2">
                    <img src="/favicon.ico" alt="Job Tracker" className="w-6 h-6" />
                    Job Tracker
                  </SheetTitle>
                  <SheetDescription className="text-sm">
                    {user?.email}
                  </SheetDescription>
                </SheetHeader>
                
                {/* Mobile Search & Filters - Matching Main Content */}
                <div className="mb-6 space-y-4 border-b border-border pb-6">
                  <motion.div 
                    className="relative w-full"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search tasks..."
                      className="pl-10 w-full transition-all duration-300 focus:ring-2 focus:ring-primary/50 h-12 text-base"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="relative w-full"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Select
                      value={filterType}
                      onValueChange={setFilterType}
                    >
                      <SelectTrigger className="w-full h-12">
                        <div className="flex items-center gap-2">
                          <SelectValue placeholder="All Tasks" className="text-base" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tasks</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                  
                  <motion.div 
                    className="relative w-full"
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Select
                      value={sortField}
                      onValueChange={(value) => {
                        setSortField(value as string);
                      }}
                    >
                      <SelectTrigger className="w-full h-12">
                        <div className="flex items-center gap-2">
                          <SelectValue placeholder="Sort by Due Date" className="text-base" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="due_date">Due Date</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <MobileMenuItem 
                    icon={<BarChart2 className="h-4 w-4" />} 
                    label="Analytics" 
                    to="/analytics" 
                  />
                  <MobileMenuItem 
                    icon={<CheckSquare className="h-4 w-4" />} 
                    label="Dashboard" 
                    to="/dashboard" 
                  />
                  <MobileMenuItem 
                    icon={<Plus className="h-4 w-4" />} 
                    label="Add Task" 
                    onClick={() => {
                      handleAddTask();
                      // Close the sheet
                      (document.querySelector('[data-radix-collection-item]') as HTMLElement)?.click();
                    }}
                    highlight
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
              Your Tasks
            </motion.h2>
            

            
            {/* Mobile Add Button - Fixed Position */}
            <motion.div
              className="sm:hidden fixed bottom-6 right-6 z-10 shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <Button
                onClick={handleAddTask}
                size="icon"
                className="h-14 w-14 rounded-full"
              >
                <Plus className="h-6 w-6" />
                <span className="sr-only">Add Task</span>
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.p 
            className="text-sm text-muted-foreground -mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {sortedTasks.length} {sortedTasks.length === 1 ? 'task' : 'tasks'} found
          </motion.p>

          {/* Search and Filters - Responsive Design */}
          <motion.div 
            className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full relative"
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
                placeholder="Search tasks..."
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
                value={filterType}
                onValueChange={handleFilterChange}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Filter tasks" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="today">Due Today</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="upcoming">Upcoming (7 days)</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
            
            <motion.div 
              className="relative flex items-center"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Select
                value={sortField}
                onValueChange={(value) => handleSort(value)}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Sort by" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="due_date">Due Date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
            
            {/* Add Task Button - Absolute Right Edge */}
            <motion.div
              className="hidden sm:block absolute right-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                onClick={handleAddTask}
                className="flex items-center gap-1 relative overflow-hidden"
              >
                <Plus className="h-4 w-4" />
                <span>Add Task</span>
                <motion.div 
                  className="absolute inset-0 bg-white/20" 
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
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
                    <AlertCircle className="h-5 w-5 text-destructive" />
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

        {/* Task List */}
        <motion.div 
          variants={itemVariants}
          className="mb-16"
        >
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : sortedTasks.length === 0 ? (
            <Card className="bg-card hover:shadow-md transition-all duration-300 border-primary/10 overflow-hidden">
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 text-muted-foreground">
                  <CheckSquare className="h-12 w-12" />
                </div>
                <h3 className="mt-2 text-sm font-medium">No tasks found</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {searchTerm || filterType !== 'all' ? 'Try changing your filters or adding a new task.' : 'Get started by adding a new task.'}
                </p>
                <Button
                  onClick={handleAddTask}
                  className="mt-6 flex items-center gap-1 relative overflow-hidden mx-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Task</span>
                </Button>
              </div>
            </Card>
          ) : (
            <TaskList 
              tasks={sortedTasks}
              onEdit={handleEditTask}
              onRefresh={fetchTasks}
              showJobInfo={true}
              loading={loading}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          )}
        </motion.div>
      </motion.main>

      <Footer />

      <AnimatePresence>
        {isFormOpen && (
          <TaskForm
            isOpen={isFormOpen}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
            task={currentTask}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskManager;
