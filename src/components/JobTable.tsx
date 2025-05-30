import React from 'react';
import { Job, SortField, SortDirection } from '../types';
import { ChevronDown, ChevronUp, ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Card } from './ui/card';

interface JobTableProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

const JobTable: React.FC<JobTableProps> = ({
  jobs,
  onEdit,
  onDelete,
  sortField,
  sortDirection,
  onSort,
}) => {
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronDown className="w-3 h-3 ml-1 text-muted-foreground opacity-50" />;
    }
    
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-3 h-3 ml-1 text-foreground" />
    ) : (
      <ChevronDown className="w-3 h-3 ml-1 text-foreground" />
    );
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800';
      case 'Interview':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800 font-medium';
      case 'Offer':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800 font-semibold';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800';
      case 'Declined':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-800';
      case 'No Response':
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-500 dark:bg-blue-400';
      case 'Interview':
        return 'bg-yellow-500 dark:bg-yellow-400';
      case 'Offer':
        return 'bg-green-500 dark:bg-green-400';
      case 'Rejected':
        return 'bg-red-500 dark:bg-red-400';
      case 'Declined':
        return 'bg-purple-500 dark:bg-purple-400';
      case 'No Response':
        return 'bg-gray-500 dark:bg-gray-400';
      default:
        return 'bg-gray-500 dark:bg-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="bg-card">
      <div className="overflow-x-auto">
        {jobs.length === 0 ? (
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium">No job applications</h3>
            <p className="mt-1 text-sm text-muted-foreground">Get started by adding a new job application.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => onSort('company')}
                >
                  <div className="flex items-center">
                    Company
                    {renderSortIcon('company')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => onSort('role')}
                >
                  <div className="flex items-center">
                    Role
                    {renderSortIcon('role')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => onSort('date_applied')}
                >
                  <div className="flex items-center">
                    Date Applied
                    {renderSortIcon('date_applied')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => onSort('location')}
                >
                  <div className="flex items-center">
                    Location
                    {renderSortIcon('location')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => onSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {renderSortIcon('status')}
                  </div>
                </TableHead>
                <TableHead>Link</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.company}</TableCell>
                  <TableCell>{job.role}</TableCell>
                  <TableCell>{formatDate(job.date_applied)}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getStatusStyle(job.status)} flex items-center justify-center gap-1 px-2 py-0.5 text-xs max-w-[110px]`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${getStatusDotColor(job.status)}`}></span>
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {job.link ? (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-0 h-auto text-blue-600 hover:text-blue-900"
                        asChild
                      >
                        <a
                          href={job.link.startsWith('http') ? job.link : `https://${job.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>View</span>
                        </a>
                      </Button>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEdit(job)}
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-900"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDelete(job.id!)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Card>
  );
};

export default JobTable;
