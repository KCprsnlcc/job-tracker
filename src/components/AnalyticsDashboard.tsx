import React from 'react';
import { AnalyticsData, JobStatus } from '../types';
import { useEffect, useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { BarChart2, PieChart, LineChart, TrendingUp, CheckSquare, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '../hooks/use-media-query';

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ff7300', '#E91E63'];

// Use a type assertion to ensure TypeScript recognizes our extended AnalyticsData type
const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ data }) => {
  // Check if mobile view
  const isMobile = useMediaQuery('(max-width: 768px)');
  
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
  
  const cardHoverVariants = {
    hover: { 
      y: -5,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 300, damping: 15 }
    }
  };
  
  const iconContainerVariants = {
    rest: { scale: 1 },
    hover: { 
      rotate: 15, 
      scale: 1.1,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };
  
  const buttonHoverVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.03,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.97 }
  };
  
  const arrowMotionVariants = {
    animate: {
      x: [0, 5, 0],
      transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
    }
  };
  
  const shineVariants = {
    rest: { x: "-100%" },
    hover: { 
      x: "100%",
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-2 md:p-0"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Job Summary Cards */}
      <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <motion.div
          whileHover="hover"
          initial="rest"
          animate="rest"
          variants={cardHoverVariants}
        >
          <Card className="overflow-hidden h-full hover:shadow-md transition-all duration-300 border-primary/10">
            <CardHeader className="pb-3 flex flex-row items-center gap-2">
              <motion.div 
                className="bg-primary/10 p-2 rounded-full"
                variants={iconContainerVariants}
              >
                <BarChart2 className="h-5 w-5 text-primary" />
              </motion.div>
              <div>
                <CardTitle>Total Applications</CardTitle>
                <CardDescription>Overall job applications</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
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
          whileHover="hover"
          initial="rest"
          animate="rest"
          variants={cardHoverVariants}
        >
          <Card className="overflow-hidden h-full hover:shadow-md transition-all duration-300 border-primary/10">
            <CardHeader className="pb-3 flex flex-row items-center gap-2">
              <motion.div 
                className="bg-primary/10 p-2 rounded-full"
                variants={iconContainerVariants}
              >
                <TrendingUp className="h-5 w-5 text-primary" />
              </motion.div>
              <div>
                <CardTitle>Response Rate</CardTitle>
                <CardDescription>Applications with responses</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
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
          whileHover="hover"
          initial="rest"
          animate="rest"
          variants={cardHoverVariants}
        >
          <Card className="overflow-hidden h-full hover:shadow-md transition-all duration-300 border-primary/10">
            <CardHeader className="pb-3 flex flex-row items-center gap-2">
              <motion.div 
                className="bg-primary/10 p-2 rounded-full"
                variants={iconContainerVariants}
              >
                <CheckSquare className="h-5 w-5 text-primary" />
              </motion.div>
              <div>
                <CardTitle>Total Tasks</CardTitle>
                <CardDescription>Active and completed tasks</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pb-3">
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
        className="col-span-1 lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6"
        variants={itemVariants}
      >
        {/* Application Status Distribution */}
        <motion.div 
          variants={chartVariants}
          whileHover="hover"
          initial="rest"
          animate="rest"
        >
        <Card className="overflow-hidden h-full hover:shadow-md transition-all duration-300 border-primary/10">
          <CardHeader className="pb-3 flex flex-row items-center gap-2">
            <motion.div 
              className="bg-primary/10 p-2 rounded-full"
              variants={iconContainerVariants}
            >
              <PieChart className="h-5 w-5 text-primary" />
            </motion.div>
            <div>
              <CardTitle>Application Status</CardTitle>
              <CardDescription>Application status breakdown</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
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
          whileHover="hover"
          initial="rest"
          animate="rest"
        >
          <Card className="overflow-hidden h-full hover:shadow-md transition-all duration-300 border-primary/10">
          <CardHeader className="pb-3 flex flex-row items-center gap-2">
            <motion.div 
              className="bg-primary/10 p-2 rounded-full"
              variants={iconContainerVariants}
            >
              <CheckSquare className="h-5 w-5 text-primary" />
            </motion.div>
            <div>
              <CardTitle>Task Status</CardTitle>
              <CardDescription>Tasks by completion status</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
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
          whileHover="hover"
          initial="rest"
          animate="rest"
        >
          <Card className="overflow-hidden h-full hover:shadow-md transition-all duration-300 border-primary/10">
          <CardHeader className="pb-3 flex flex-row items-center gap-2">
            <motion.div 
              className="bg-primary/10 p-2 rounded-full"
              variants={iconContainerVariants}
            >
              <LineChart className="h-5 w-5 text-primary" />
            </motion.div>
            <div>
              <CardTitle>Applications Over Time</CardTitle>
              <CardDescription>Monthly application volume</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
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
          whileHover="hover"
          initial="rest"
          animate="rest"
        >
          <Card className="overflow-hidden h-full hover:shadow-md transition-all duration-300 border-primary/10">
          <CardHeader className="pb-3 flex flex-row items-center gap-2">
            <motion.div 
              className="bg-primary/10 p-2 rounded-full"
              variants={iconContainerVariants}
            >
              <BarChart2 className="h-5 w-5 text-primary" />
            </motion.div>
            <div>
              <CardTitle>Top Companies</CardTitle>
              <CardDescription>Most applied to companies</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
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
          whileHover="hover"
          initial="rest"
          animate="rest"
        >
          <Card className="overflow-hidden h-full hover:shadow-md transition-all duration-300 border-primary/10">
          <CardHeader className="pb-3 flex flex-row items-center gap-2">
            <motion.div 
              className="bg-primary/10 p-2 rounded-full"
              variants={iconContainerVariants}
            >
              <TrendingUp className="h-5 w-5 text-primary" />
            </motion.div>
            <div>
              <CardTitle>Key Performance Metrics</CardTitle>
              <CardDescription>Job search effectiveness</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div 
              variants={itemVariants}
              whileHover="hover"
              initial="rest"
              animate="rest"
              className="flex flex-col items-center justify-center p-3 bg-background rounded-lg border hover:border-primary/30 hover:shadow-md transition-all duration-300"
            >
              <span className="text-muted-foreground text-sm">Total Applications Sent</span>
              <span className="text-2xl font-bold">{analyticsData.totalApplications}</span>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              whileHover="hover"
              initial="rest"
              animate="rest"
              className="flex flex-col items-center justify-center p-3 bg-background rounded-lg border hover:border-primary/30 hover:shadow-md transition-all duration-300"
            >
              <span className="text-muted-foreground text-sm">Response Rate</span>
              <span className="text-2xl font-bold">{analyticsData.responseRate.toFixed(1)}%</span>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              whileHover="hover"
              initial="rest"
              animate="rest"
              className="flex flex-col items-center justify-center p-3 bg-background rounded-lg border hover:border-primary/30 hover:shadow-md transition-all duration-300"
            >
              <span className="text-muted-foreground text-sm">Interview Rate</span>
              <span className="text-2xl font-bold">{analyticsData.interviewRate.toFixed(1)}%</span>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              whileHover="hover"
              initial="rest"
              animate="rest"
              className="flex flex-col items-center justify-center p-3 bg-background rounded-lg border hover:border-primary/30 hover:shadow-md transition-all duration-300"
            >
              <span className="text-muted-foreground text-sm">Rejection Rate</span>
              <span className="text-2xl font-bold">
                {((analyticsData.byStatus['Rejected'] || 0) / analyticsData.totalApplications * 100).toFixed(1)}%
              </span>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              whileHover="hover"
              initial="rest"
              animate="rest"
              className="flex flex-col items-center justify-center p-3 bg-background rounded-lg border hover:border-primary/30 hover:shadow-md transition-all duration-300"
            >
              <span className="text-muted-foreground text-sm">Offer Rate</span>
              <span className="text-2xl font-bold">{analyticsData.offerRate.toFixed(1)}%</span>
            </motion.div>
            <motion.div 
              variants={itemVariants}
              whileHover="hover"
              initial="rest"
              animate="rest"
              className="flex flex-col items-center justify-center p-3 bg-background rounded-lg border hover:border-primary/30 hover:shadow-md transition-all duration-300"
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
