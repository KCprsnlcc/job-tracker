import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasks, getDueTasks } from '../services/taskService';
import { Task } from '../types';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import Footer from '../components/Footer';
import { ThemeToggle } from '../components/theme-toggle';
import { LogOut, CheckSquare, Plus, Clock, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const TaskManager: React.FC = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [filterType, setFilterType] = useState('all');

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

  const filteredTasks = tasks.filter(task => {
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
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Link to="/dashboard" className="flex items-center gap-2">
              <img src="/favicon.ico" alt="Job Tracker" className="w-6 h-6" />
              Job Tracker
            </Link>
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
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Task Management
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Keep track of your job search tasks and follow-ups
            </p>
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative flex items-center gap-2">
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
            </div>

            <Button
              onClick={handleAddTask}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Task</span>
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

        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-1" onClick={() => setFilterType('all')}>
              <CheckSquare className="h-4 w-4" />
              All Tasks
            </TabsTrigger>
            <TabsTrigger value="today" className="flex items-center gap-1" onClick={() => setFilterType('today')}>
              <Clock className="h-4 w-4" />
              Due Today
            </TabsTrigger>
            <TabsTrigger value="overdue" className="flex items-center gap-1" onClick={() => setFilterType('overdue')}>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Overdue
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <TaskList
          tasks={filteredTasks}
          onEdit={handleEditTask}
          onRefresh={fetchTasks}
          showJobInfo={true}
          loading={loading}
        />

        <div className="mt-6 flex justify-end">
          <Button variant="outline" asChild>
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </main>

      <TaskForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        task={currentTask}
        onSuccess={handleFormSuccess}
      />
      
      <Footer />
    </div>
  );
};

export default TaskManager;
