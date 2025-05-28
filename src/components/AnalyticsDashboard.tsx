import React from 'react';
import { AnalyticsData } from '../types';
import { useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ff7300', '#E91E63'];

// Use a type assertion to ensure TypeScript recognizes our extended AnalyticsData type
const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data }) => {
  // Cast data to include task analytics properties
  const analyticsData = data as AnalyticsData & {
    totalTasks: number;
    tasksByStatus: Record<string, number>;
    tasksByPriority: Record<string, number>;
    upcomingTasksDue: number;
  };
  // Verify that task analytics data exists
  useEffect(() => {
    console.log('Task Analytics:', { 
      totalTasks: analyticsData.totalTasks, 
      tasksByStatus: analyticsData.tasksByStatus,
      tasksByPriority: analyticsData.tasksByPriority
    });
  }, [analyticsData]);
  // Format status data for pie chart
  const statusData = Object.entries(analyticsData.byStatus).map(([name, value]) => ({
    name,
    value
  }));

  // Format company data for bar chart
  const companyData = Object.entries(analyticsData.byCompany)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10) // Top 10 companies
    .map(([name, value]) => ({
      name: name.length > 15 ? name.substring(0, 12) + '...' : name,
      applications: value
    }));

  // Format monthly data for line chart
  const monthlyData = Object.entries(analyticsData.applicationsByMonth)
    .map(([name, value]) => ({
      name,
      applications: value
    }))
    .slice(-6); // Last 6 months

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Job Summary Cards */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Total Applications</CardTitle>
          <CardDescription>Overall job applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{analyticsData.totalApplications}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Response Rate</CardTitle>
          <CardDescription>Percentage of applications with responses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            {analyticsData.responseRate.toFixed(1)}%
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Total Tasks</CardTitle>
          <CardDescription>Active and completed tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{analyticsData.totalTasks || 0}</div>
          <div className="text-sm text-muted-foreground mt-1">
            <span className="text-green-600 font-medium">{(analyticsData.tasksByStatus && analyticsData.tasksByStatus['Completed']) || 0}</span> completed, 
            <span className="text-blue-600 font-medium"> {(analyticsData.tasksByStatus && analyticsData.tasksByStatus['Pending']) || 0}</span> pending
          </div>
        </CardContent>
      </Card>

      {/* Status Distribution Pie Charts */}
      <div className="col-span-1 lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Application Status Distribution</CardTitle>
            <CardDescription>Breakdown of your application statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value} applications`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>Breakdown of your tasks by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {analyticsData.tasksByStatus && Object.keys(analyticsData.tasksByStatus).length > 0 ? (
                  <PieChart>
                    <Pie
                      data={Object.entries(analyticsData.tasksByStatus || {}).map(([name, value]) => ({
                        name,
                        value
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.entries(analyticsData.tasksByStatus || {}).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [`${value} tasks`, name]}
                    />
                    <Legend />
                  </PieChart>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No task data available</p>
                  </div>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Applications by Month */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Applications Over Time</CardTitle>
          <CardDescription>Monthly application volume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Companies */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Top Companies Applied To</CardTitle>
          <CardDescription>Companies with most applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={companyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Key Performance Metrics</CardTitle>
          <CardDescription>Your job search effectiveness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg border">
              <span className="text-muted-foreground text-sm">Total Applications Sent</span>
              <span className="text-2xl font-bold">{analyticsData.totalApplications}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg border">
              <span className="text-muted-foreground text-sm">Response Rate</span>
              <span className="text-2xl font-bold">{analyticsData.responseRate.toFixed(1)}%</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg border">
              <span className="text-muted-foreground text-sm">Interview Rate</span>
              <span className="text-2xl font-bold">{analyticsData.interviewRate.toFixed(1)}%</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg border">
              <span className="text-muted-foreground text-sm">Rejection Rate</span>
              <span className="text-2xl font-bold">
                {((analyticsData.byStatus['Rejected'] || 0) / analyticsData.totalApplications * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg border">
              <span className="text-muted-foreground text-sm">Offer Rate</span>
              <span className="text-2xl font-bold">{analyticsData.offerRate.toFixed(1)}%</span>
            </div>
            {analyticsData.averageResponseTime && (
              <div className="flex flex-col items-center justify-center p-4 bg-background rounded-lg border">
                <span className="text-muted-foreground text-sm">Avg. Response Time</span>
                <span className="text-2xl font-bold">{analyticsData.averageResponseTime.toFixed(1)} days</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
