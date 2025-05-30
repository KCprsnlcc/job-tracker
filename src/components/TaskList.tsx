import React, { useState } from 'react';
import { Task } from '../types';
import { completeTask, deleteTask } from '../services/taskService';
import { format } from 'date-fns';
import { Check, Edit, Trash, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import DeleteConfirmation from './DeleteConfirmation';
import { useToast } from '../hooks/use-toast';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onRefresh: () => void;
  showJobInfo?: boolean;
  loading?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onRefresh,
  showJobInfo = false,
  loading = false,
}) => {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const handleComplete = async (task: Task) => {
    try {
      await completeTask(task.id!, !task.completed);
      onRefresh();
      toast({
        title: task.completed ? 'Task marked as incomplete' : 'Task completed',
        description: `Task "${task.title}" has been ${task.completed ? 'marked as incomplete' : 'marked as complete'}.`,
        variant: 'default',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update task',
        variant: 'destructive',
      });
    }
  };

  const openDeleteDialog = (taskId: string) => {
    setTaskToDelete(taskId);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    
    try {
      await deleteTask(taskToDelete);
      onRefresh();
      closeDeleteDialog();
      toast({
        title: 'Task Deleted',
        description: 'The task has been successfully deleted.',
        variant: 'destructive',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete task',
        variant: 'destructive',
      });
      closeDeleteDialog();
    }
  };

  const getPriorityColor = (priority: string) => {
    const lowerPriority = priority.toLowerCase();
    switch (lowerPriority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800 font-semibold';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800 font-medium';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getDueDateColor = (dueDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(dueDate);
    taskDate.setHours(0, 0, 0, 0);
    
    // If due date is in the past
    if (taskDate < today) {
      return 'text-destructive font-semibold';
    }
    
    // If due date is today
    if (taskDate.getTime() === today.getTime()) {
      return 'text-yellow-600 dark:text-yellow-400 font-semibold';
    }
    
    // If due date is tomorrow
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (taskDate.getTime() === tomorrow.getTime()) {
      return 'text-blue-600 dark:text-blue-400 font-semibold';
    }
    
    return '';
  };
  
  // Render task cards for mobile view
  const renderMobileTaskCards = () => {
    return tasks.map((task) => (
      <motion.div 
        key={task.id}
        className="mb-4 last:mb-0"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Card className={`p-4 shadow-sm ${task.completed ? 'bg-muted/50' : ''}`}>
          <div className="flex items-start gap-3">
            <div className="pt-0.5">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => handleComplete(task)}
              />
            </div>
            <div className="flex-1">
              <div className="flex flex-col">
                <h3 className={`font-medium text-base ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'} mt-1`}>
                    {task.description}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                {showJobInfo && task.job_id && task.job_info && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Job: </span>
                    <span className="font-medium">{task.job_info.company}</span>
                    {task.job_info.role && (
                      <span className="text-xs text-muted-foreground ml-1">({task.job_info.role})</span>
                    )}
                  </div>
                )}
                <div>
                  <Badge variant="outline" className={`${getPriorityColor(task.priority)} flex items-center justify-center gap-1 px-2 py-0.5 text-xs`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${task.priority.toLowerCase() === 'high' ? 'bg-red-500 dark:bg-red-400' : task.priority.toLowerCase() === 'medium' ? 'bg-yellow-500 dark:bg-yellow-400' : 'bg-green-500 dark:bg-green-400'}`}></span>
                    {task.priority}
                  </Badge>
                </div>
                <div className={getDueDateColor(task.due_date)}>
                  {format(new Date(task.due_date), 'MMM d, yyyy')}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              {!task.completed && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(task)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span className="sr-only">Edit</span>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openDeleteDialog(task.id!)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
              >
                <Trash className="h-3.5 w-3.5" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    ));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return null; // Removing duplicate "No tasks found" message that's shown in TaskManager
  }

  return (
    <>
      {/* Desktop Table View - Hidden on Mobile */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Task</TableHead>
              {showJobInfo && <TableHead>Related Job</TableHead>}
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow
                key={task.id}
                className={task.completed ? 'bg-muted/50' : ''}
              >
                <TableCell>
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleComplete(task)}
                  />
                </TableCell>
                <TableCell className={task.completed ? 'line-through text-muted-foreground' : ''}>
                  <div className="font-medium">{task.title}</div>
                  {task.description && (
                    <div className="text-sm text-muted-foreground truncate max-w-xs">
                      {task.description}
                    </div>
                  )}
                </TableCell>
                {showJobInfo && (
                  <TableCell>
                    {task.job_id && task.job_info ? (
                      <div>
                        <div className="font-medium">{task.job_info.company}</div>
                        <div className="text-sm text-muted-foreground">{task.job_info.role}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </TableCell>
                )}
                <TableCell>
                  <Badge variant="outline" className={`${getPriorityColor(task.priority)} flex items-center justify-center gap-1 px-2 py-0.5 text-xs max-w-[80px]`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${task.priority.toLowerCase() === 'high' ? 'bg-red-500 dark:bg-red-400' : task.priority.toLowerCase() === 'medium' ? 'bg-yellow-500 dark:bg-yellow-400' : 'bg-green-500 dark:bg-green-400'}`}></span>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell className={getDueDateColor(task.due_date)}>
                  {format(new Date(task.due_date), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {!task.completed && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(task)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(task.id!)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                    >
                      <Trash className="h-3.5 w-3.5" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Mobile Card View - Shown only on Mobile */}
      <div className="md:hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Tasks</h2>
          </div>
          {renderMobileTaskCards()}
        </div>
      </div>

      <DeleteConfirmation
        isOpen={deleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDeleteTask}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
      />
    </>
  );
};

export default TaskList;