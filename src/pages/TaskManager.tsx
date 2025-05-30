import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasks } from '../services/taskService';
import { Task } from '../types';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import Footer from '../components/Footer';
import { ThemeToggle } from '../components/theme-toggle';
import { LogOut, CheckSquare, Plus, Clock, Filter, Check, ArrowLeft, AlertCircle, Search } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
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
              <span className="sm:hidden">JT</span>
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
                onClick={() => signOut()}
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
          
          {/* Mobile Navigation */}
          <motion.div 
            className="md:hidden flex items-center space-x-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ThemeToggle />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => signOut()}
                className="relative overflow-hidden"
              >
                <LogOut className="h-4 w-4" />
                <motion.div 
                  className="absolute inset-0 bg-primary/10" 
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.header>

      <motion.main 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0"
          variants={itemVariants}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.h2 
              className="text-xl font-semibold flex items-center gap-2"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <CheckSquare className="h-5 w-5 text-primary" />
              </motion.div>
              Task Management
            </motion.h2>
            <motion.p 
              className="text-sm text-muted-foreground mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Keep track of your job search tasks and follow-ups
            </motion.p>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search tasks..."
                className="pl-8 w-full sm:w-[200px] lg:w-[300px] transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                value={searchTerm}
                onChange={handleSearch}
              />
            </motion.div>

            <motion.div 
              className="relative flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={filterType}
                onValueChange={handleFilterChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter tasks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="pending">Pending Tasks</SelectItem>
                  <SelectItem value="completed">Completed Tasks</SelectItem>
                  <SelectItem value="today">Due Today</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="upcoming">Next 7 Days</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" asChild className="relative overflow-hidden">
                <Link to="/dashboard" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                  <motion.div 
                    className="absolute inset-0 bg-primary/10" 
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                </Link>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleAddTask}
                className="flex items-center gap-2 relative overflow-hidden"
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
                    animate={{ scale: 1, rotate: 360 }}
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

        <motion.div
          variants={itemVariants}
          layoutId="tabs-container"
        >
          <Tabs defaultValue={filterType} value={filterType} className="mb-6">
            <TabsList>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                layout
              >
                <TabsTrigger value="all" className="flex items-center gap-1" onClick={() => setFilterType('all')}>
                  <motion.div whileHover={{ rotate: 15 }} layout>
                    <CheckSquare className="h-4 w-4" />
                  </motion.div>
                  All Tasks
                </TabsTrigger>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                layout
              >
                <TabsTrigger value="today" className="flex items-center gap-1" onClick={() => setFilterType('today')}>
                  <motion.div whileHover={{ rotate: 15 }} layout>
                    <Clock className="h-4 w-4" />
                  </motion.div>
                  Due Today
                </TabsTrigger>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                layout
              >
                <TabsTrigger value="overdue" className="flex items-center gap-1" onClick={() => setFilterType('overdue')}>
                  <motion.div whileHover={{ rotate: 15 }} layout>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                  Overdue
                </TabsTrigger>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                layout
              >
                <TabsTrigger value="completed" className="flex items-center gap-1" onClick={() => setFilterType('completed')}>
                  <motion.div whileHover={{ rotate: 15 }} layout>
                    <Check className="h-4 w-4" />
                  </motion.div>
                  Completed
                </TabsTrigger>
              </motion.div>
            </TabsList>
          </Tabs>
        </motion.div>
        


        <motion.div 
          className="mt-6"
          variants={itemVariants}
        >
          <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border-primary/10">
            <CardContent className="p-4 sm:p-6">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 text-muted-foreground">
                    <svg
                      className="h-12 w-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium">No tasks found</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {filterType === 'all' 
                      ? 'Get started by creating a new task.' 
                      : 'Try changing your filters to see more tasks.'}
                  </p>
                </div>
              ) : (
                <TaskList 
                  tasks={filteredTasks} 
                  onEdit={handleEditTask} 
                  onRefresh={fetchTasks}
                  showJobInfo={true}
                  loading={loading}
                />
              )}
            </CardContent>
          </Card>
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
              key="tasklist"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              variants={itemVariants}
            >
            </motion.div>
          )}
        </AnimatePresence>


      </motion.main>

      <TaskForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        task={currentTask}
        onSuccess={handleFormSuccess}
      />
      
      <Footer />
    </motion.div>
  );
};

export default TaskManager;
