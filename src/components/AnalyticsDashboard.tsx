import React from 'react';
import { AnalyticsData, JobStatus } from '../types';
import { useEffect, useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { motion } from 'framer-motion';

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
  
  // Format task status data for pie chart
  const taskStatusData = useMemo(() => {
    return analyticsData.tasksByStatus 
      ? Object.entries(analyticsData.tasksByStatus).map(([name, value], index) => ({
          name,
          y: value,
          color: COLORS[index % COLORS.length],
          sliced: index === 0,
          selected: index === 0
        }))
      : [];
  }, [analyticsData.tasksByStatus]);

  // Verify that task analytics data exists
  useEffect(() => {
    console.log('Task Analytics:', { 
      totalTasks: analyticsData.totalTasks, 
      tasksByStatus: analyticsData.tasksByStatus,
      tasksByPriority: analyticsData.tasksByPriority,
      formattedTaskData: taskStatusData
    });
  }, [analyticsData, taskStatusData]);
  // Format status data for pie chart
  const statusData = Object.entries(analyticsData.byStatus).map(([name, value]) => ({
    name,
    y: value
  }));

  // Format company data for bar chart
  const companyData = Object.entries(analyticsData.byCompany)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10) // Top 10 companies
    .map(([name, value]) => ({
      name: name.length > 15 ? name.substring(0, 12) + '...' : name,
      y: value
    }));

  // Format monthly data for line chart
  const monthlyData = Object.entries(analyticsData.applicationsByMonth)
    .map(([name, value]) => ([
      name,
      value
    ]))
    .slice(-6); // Last 6 months

  // Animation variants
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

  const chartVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 20, delay: 0.2 }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Job Summary Cards */}
      <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ 
            scale: 1.05, 
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Applications</CardTitle>
              <CardDescription>Overall job applications</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-4xl font-bold"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20, 
                  delay: 0.2 
                }}
              >
                {analyticsData.totalApplications}
              </motion.div>
              <motion.div 
                className="text-sm text-muted-foreground mt-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <span className="text-green-600 font-medium">
                  {(analyticsData.byStatus?.[JobStatus.INTERVIEW] || 0) + 
                   (analyticsData.byStatus?.[JobStatus.OFFER] || 0) + 
                   (analyticsData.byStatus?.[JobStatus.REJECTED] || 0)}
                </span> responded, <span className="text-blue-600 font-medium">
                  {(analyticsData.byStatus?.[JobStatus.APPLIED] || 0) + 
                   (analyticsData.byStatus?.[JobStatus.NO_RESPONSE] || 0)}
                </span> pending
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ 
            scale: 1.05, 
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Response Rate</CardTitle>
              <CardDescription>Percentage of applications with responses</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-4xl font-bold"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20, 
                  delay: 0.3 
                }}
              >
                {analyticsData.responseRate.toFixed(1)}%
              </motion.div>
              <motion.div 
                className="text-sm text-muted-foreground mt-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <span className="text-green-600 font-medium">
                  {(analyticsData.byStatus?.[JobStatus.INTERVIEW] || 0) + 
                   (analyticsData.byStatus?.[JobStatus.OFFER] || 0) + 
                   (analyticsData.byStatus?.[JobStatus.REJECTED] || 0)}
                </span> applications with responses
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ 
            scale: 1.05, 
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Tasks</CardTitle>
              <CardDescription>Active and completed tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="text-4xl font-bold"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20, 
                  delay: 0.4 
                }}
              >
                {analyticsData.totalTasks || 0}
              </motion.div>
              <motion.div 
                className="text-sm text-muted-foreground mt-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <span className="text-green-600 font-medium">{(analyticsData.tasksByStatus && analyticsData.tasksByStatus['Completed']) || 0}</span> completed, 
                <span className="text-blue-600 font-medium"> {(analyticsData.tasksByStatus && analyticsData.tasksByStatus['Pending']) || 0}</span> pending
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Status Distribution Pie Charts */}
      <motion.div 
        className="col-span-1 lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6"
        variants={itemVariants}
      >
        {/* Application Status Distribution */}
        <motion.div 
          variants={chartVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
        <Card>
          <CardHeader>
            <CardTitle>Application Status Distribution</CardTitle>
            <CardDescription>Breakdown of your application statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <HighchartsReact
                highcharts={Highcharts}
                options={{
                  chart: {
                    type: 'pie',
                    height: 300,
                    backgroundColor: 'transparent'
                  },
                  title: {
                    text: ''
                  },
                  tooltip: {
                    pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b> ({point.y} applications)'
                  },
                  accessibility: {
                    point: {
                      valueSuffix: '%'
                    }
                  },
                  plotOptions: {
                    pie: {
                      allowPointSelect: true,
                      cursor: 'pointer',
                      colors: COLORS,
                      dataLabels: {
                        enabled: true,
                        format: '{point.percentage:.1f}%',
                        distance: -30,
                        style: {
                          fontWeight: 'bold',
                          fontSize: '12px',
                          textOutline: '1px contrast',
                          color: '#ffffff'
                        }
                      },
                      startAngle: 0,
                      endAngle: 360,
                      innerSize: '40%',
                      showInLegend: true
                    }
                  },
                  legend: {
                    enabled: true,
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    itemMarginTop: 5,
                    itemMarginBottom: 5
                  },
                  credits: {
                    enabled: false
                  },
                  series: [{
                    name: 'Applications',
                    colorByPoint: true,
                    data: statusData
                  }]
                }}
              />
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Task Status Distribution */}
        <motion.div 
          variants={chartVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
            <CardDescription>Breakdown of your tasks by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {taskStatusData.length > 0 ? (
                <HighchartsReact
                  highcharts={Highcharts}
                  options={{
                    chart: {
                      type: 'pie',
                      height: 300,
                      backgroundColor: 'transparent'
                    },
                    title: {
                      text: ''
                    },
                    tooltip: {
                      pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b> ({point.y} tasks)'
                    },
                    accessibility: {
                      point: {
                        valueSuffix: '%'
                      }
                    },
                    plotOptions: {
                      pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        colors: COLORS,
                        dataLabels: {
                          enabled: true,
                          format: '{point.percentage:.1f}%',
                          distance: -30,
                          style: {
                            fontWeight: 'bold',
                            fontSize: '12px',
                            textOutline: '1px contrast',
                            color: '#ffffff'
                          }
                        },
                        startAngle: 0,
                        endAngle: 360,
                        innerSize: '40%',
                        showInLegend: true
                      }
                    },
                    legend: {
                      enabled: true,
                      layout: 'vertical',
                      align: 'right',
                      verticalAlign: 'middle',
                      itemMarginTop: 5,
                      itemMarginBottom: 5
                    },
                    credits: {
                      enabled: false
                    },
                    series: [{
                      name: 'Tasks',
                      colorByPoint: true,
                      data: taskStatusData
                    }]
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No task data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        </motion.div>
      </motion.div>



      {/* Applications by Month */}
      <motion.div 
        className="col-span-1 md:col-span-2 lg:col-span-3"
        variants={itemVariants}
      >
        <motion.div 
          variants={chartVariants}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Card>
        <CardHeader>
          <CardTitle>Applications Over Time</CardTitle>
          <CardDescription>Monthly application volume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <HighchartsReact
              highcharts={Highcharts}
              options={{
                chart: {
                  type: 'line',
                  height: 300,
                  backgroundColor: 'transparent'
                },
                title: {
                  text: ''
                },
                xAxis: {
                  type: 'category'
                },
                yAxis: {
                  title: {
                    text: 'Applications'
                  },
                  min: 0
                },
                plotOptions: {
                  line: {
                    dataLabels: {
                      enabled: true
                    },
                    enableMouseTracking: true,
                    marker: {
                      enabled: true
                    }
                  }
                },
                tooltip: {
                  formatter: function(this: { key: string; y: number }): string {
                    return `<b>${this.key}</b><br/>${this.y} applications`;
                  }
                },
                credits: {
                  enabled: false
                },
                series: [{
                  name: 'Applications',
                  color: '#8884d8',
                  data: monthlyData
                }]
              }}
            />
          </div>
        </CardContent>
      </Card>
        </motion.div>
      </motion.div>

      {/* Top Companies */}
      <motion.div 
        className="col-span-1 md:col-span-2 lg:col-span-3"
        variants={itemVariants}
      >
        <motion.div 
          variants={chartVariants}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Card>
        <CardHeader>
          <CardTitle>Top Companies Applied To</CardTitle>
          <CardDescription>Companies with most applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <HighchartsReact
              highcharts={Highcharts}
              options={{
                chart: {
                  type: 'bar',
                  height: 300,
                  backgroundColor: 'transparent'
                },
                title: {
                  text: ''
                },
                xAxis: {
                  type: 'category',
                  categories: companyData.map(item => item.name)
                },
                yAxis: {
                  title: {
                    text: 'Applications'
                  },
                  min: 0
                },
                legend: {
                  enabled: false
                },
                tooltip: {
                  formatter: function(this: { key: string; y: number }): string {
                    return `<b>${this.key}</b><br/>${this.y} applications`;
                  }
                },
                plotOptions: {
                  bar: {
                    colorByPoint: true,
                    colors: COLORS
                  }
                },
                credits: {
                  enabled: false
                },
                series: [{
                  name: 'Applications',
                  data: companyData.map(item => item.y)
                }]
              }}
            />
          </div>
        </CardContent>
      </Card>
        </motion.div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div 
        className="col-span-1 md:col-span-2 lg:col-span-3"
        variants={itemVariants}
      >
        <motion.div 
          variants={chartVariants}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Card>
        <CardHeader>
          <CardTitle>Key Performance Metrics</CardTitle>
          <CardDescription>Your job search effectiveness</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              className="flex flex-col items-center justify-center p-4 bg-background rounded-lg border"
            >
              <span className="text-muted-foreground text-sm">Total Applications Sent</span>
              <span className="text-2xl font-bold">{analyticsData.totalApplications}</span>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              className="flex flex-col items-center justify-center p-4 bg-background rounded-lg border"
            >
              <span className="text-muted-foreground text-sm">Response Rate</span>
              <span className="text-2xl font-bold">{analyticsData.responseRate.toFixed(1)}%</span>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              className="flex flex-col items-center justify-center p-4 bg-background rounded-lg border"
            >
              <span className="text-muted-foreground text-sm">Interview Rate</span>
              <span className="text-2xl font-bold">{analyticsData.interviewRate.toFixed(1)}%</span>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              className="flex flex-col items-center justify-center p-4 bg-background rounded-lg border"
            >
              <span className="text-muted-foreground text-sm">Rejection Rate</span>
              <span className="text-2xl font-bold">
                {((analyticsData.byStatus['Rejected'] || 0) / analyticsData.totalApplications * 100).toFixed(1)}%
              </span>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              className="flex flex-col items-center justify-center p-4 bg-background rounded-lg border"
            >
              <span className="text-muted-foreground text-sm">Offer Rate</span>
              <span className="text-2xl font-bold">{analyticsData.offerRate.toFixed(1)}%</span>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              className="flex flex-col items-center justify-center p-4 bg-background rounded-lg border"
            >
              <span className="text-muted-foreground text-sm">Avg. Response Time</span>
              <span className="text-2xl font-bold">{(analyticsData.averageResponseTime || 1.0).toFixed(1)} days</span>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsDashboard;
