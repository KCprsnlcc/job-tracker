import React, { useState } from 'react';
import { Task } from '../types';
import { completeTask, deleteTask } from '../services/taskService';
import { format } from 'date-fns';
import { Check, X, Edit, Trash, AlertCircle } from 'lucide-react';

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
    switch (priority) {
      case 'High':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-500';
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-500';
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

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No tasks found</h3>
        <p className="text-muted-foreground mt-2">
          You don't have any tasks yet. Add a new task to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
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
                    {task.job_id ? (
                      <div>Job info</div>
                    ) : (
                      <span className="text-muted-foreground text-sm">None</span>
                    )}
                  </TableCell>
                )}
                <TableCell>
                  <Badge variant="outline" className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </TableCell>
                <TableCell className={getDueDateColor(task.due_date)}>
                  {format(new Date(task.due_date), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(task)}
                      disabled={task.completed}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(task.id!)}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
