import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format as formatDate } from 'date-fns';
import { X, Download, FileJson, FileSpreadsheet, FileText, BarChart2, Calendar, Clock, MailIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import { ExportOptions, ExportFilter, ScheduledExport, executeExport, createScheduledExport } from '../services/exportService';

// Import shadcn components
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { DatePicker } from './ui/date-picker';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExportDialog: React.FC<ExportDialogProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('instant');
  
  // Export format state
  const [format, setFormat] = useState<'json' | 'csv' | 'pdf' | 'xml'>('csv');
  
  // Filter state
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [company, setCompany] = useState('');
  const [includeNotes, setIncludeNotes] = useState(true);
  const [includeTasks, setIncludeTasks] = useState(false);
  const [exportName, setExportName] = useState('job-applications');
  
  // Scheduled export state
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [destination, setDestination] = useState<'email' | 'download'>('download');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize email with user's email
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user]);
  
  const handleStatusChange = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };
  
  const resetForm = () => {
    setFormat('csv');
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedStatuses([]);
    setCompany('');
    setIncludeNotes(true);
    setIncludeTasks(false);
    setExportName('job-applications');
    setFrequency('weekly');
    setDestination('download');
    setActiveTab('instant');
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const handleExport = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const filters: ExportFilter = {
        startDate: startDate ? formatDate(startDate, 'yyyy-MM-dd') : undefined,
        endDate: endDate ? formatDate(endDate, 'yyyy-MM-dd') : undefined,
        status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
        company: company || undefined,
        includeNotes,
        includeTasks,
      };
      
      const options: ExportOptions = {
        format: format,
        filters,
        exportName,
      };
      
      await executeExport(user.id, options);
      
      toast({
        title: 'Export Successful',
        description: `Your job data has been exported in ${format.toUpperCase()} format.`,
      });
      
      handleClose();
    } catch (error: any) {
      toast({
        title: 'Export Failed',
        description: error.message || 'There was an error exporting your data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleScheduleExport = async () => {
    if (!user) return;
    
    if (destination === 'email' && !email) {
      toast({
        title: 'Email Required',
        description: 'Please provide an email address for scheduled exports.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const filters: ExportFilter = {
        startDate: startDate ? formatDate(startDate, 'yyyy-MM-dd') : undefined,
        endDate: endDate ? formatDate(endDate, 'yyyy-MM-dd') : undefined,
        status: selectedStatuses.length > 0 ? selectedStatuses : undefined,
        company: company || undefined,
        includeNotes,
        includeTasks,
      };
      
      const options: ExportOptions = {
        format: format,
        filters,
        exportName,
      };
      
      const scheduledExport: ScheduledExport = {
        userId: user.id,
        frequency,
        options,
        destination,
        email: destination === 'email' ? email : undefined,
      };
      
      await createScheduledExport(scheduledExport);
      
      toast({
        title: 'Export Scheduled',
        description: `Your ${frequency} export has been scheduled successfully.`,
      });
      
      handleClose();
    } catch (error: any) {
      toast({
        title: 'Scheduling Failed',
        description: error.message || 'There was an error scheduling your export.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatIcons = {
    json: <FileJson className="h-5 w-5" />,
    csv: <FileSpreadsheet className="h-5 w-5" />,
    pdf: <FileText className="h-5 w-5" />,
    xml: <BarChart2 className="h-5 w-5" />,
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Job Application Data
          </DialogTitle>
          <DialogDescription>
            Export your job application data in various formats with customizable options.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="instant" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>Instant Export</span>
            </TabsTrigger>
            <TabsTrigger value="scheduled" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Scheduled Export</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="instant" className="mt-4">
            <div className="space-y-6">
              {/* Format Selection */}
              <div className="space-y-2">
                <Label>Export Format</Label>
                <div className="grid grid-cols-4 gap-2">
                  {(['json', 'csv', 'xml', 'pdf'] as const).map((f) => (
                    <motion.div 
                      key={f}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card 
                        className={`cursor-pointer ${format === f ? 'border-primary bg-primary/10' : ''}`}
                        onClick={() => setFormat(f)}
                      >
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          {formatIcons[f]}
                          <span className="mt-2 text-sm font-medium uppercase">{f}</span>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Filter Options */}
              <div className="space-y-4">
                <Label className="text-base">Filter Options</Label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <DatePicker
                      date={startDate}
                      setDate={setStartDate}
                      className="w-full"
                      placeholder="Select start date"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <DatePicker
                      date={endDate}
                      setDate={setEndDate}
                      className="w-full"
                      placeholder="Select end date"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    placeholder="Filter by company name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Applied', 'Interview', 'Offer', 'Rejected', 'Declined'].map((status) => (
                      <Badge
                        key={status}
                        variant={selectedStatuses.includes(status) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => handleStatusChange(status)}
                      >
                        {status}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Include Options</Label>
                  <div className="flex space-x-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="includeNotes" 
                        checked={includeNotes} 
                        onCheckedChange={(checked) => setIncludeNotes(!!checked)} 
                      />
                      <Label htmlFor="includeNotes" className="text-sm font-normal">Include Notes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="includeTasks" 
                        checked={includeTasks} 
                        onCheckedChange={(checked) => setIncludeTasks(!!checked)} 
                      />
                      <Label htmlFor="includeTasks" className="text-sm font-normal">Include Tasks</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Export Name</Label>
                  <Input
                    placeholder="Name of export file"
                    value={exportName}
                    onChange={(e) => setExportName(e.target.value)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={handleClose}>Cancel</Button>
                <Button 
                  onClick={handleExport} 
                  disabled={isLoading}
                  className="relative overflow-hidden"
                >
                  {isLoading ? 'Exporting...' : 'Export Now'}
                  <motion.div 
                    className="absolute inset-0 bg-primary/10" 
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                </Button>
              </DialogFooter>
            </div>
          </TabsContent>
          
          <TabsContent value="scheduled" className="mt-4">
            <div className="space-y-6">
              {/* Format Selection */}
              <div className="space-y-2">
                <Label>Export Format</Label>
                <div className="grid grid-cols-4 gap-2">
                  {(['json', 'csv', 'xml', 'pdf'] as const).map((f) => (
                    <motion.div 
                      key={f}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Card 
                        className={`cursor-pointer ${format === f ? 'border-primary bg-primary/10' : ''}`}
                        onClick={() => setFormat(f)}
                      >
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          {formatIcons[f]}
                          <span className="mt-2 text-sm font-medium uppercase">{f}</span>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Schedule Options */}
              <div className="space-y-4">
                <Label className="text-base">Schedule Options</Label>
                
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select value={frequency} onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setFrequency(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Delivery Method</Label>
                  <RadioGroup value={destination} onValueChange={(value: 'email' | 'download') => setDestination(value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="download" id="download" />
                      <Label htmlFor="download" className="font-normal">Download to Device</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email" />
                      <Label htmlFor="email" className="font-normal">Send to Email</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                {destination === 'email' && (
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                )}
              </div>
              
              {/* Filter Options */}
              <div className="space-y-4">
                <Label className="text-base">Filter Options</Label>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <DatePicker
                      date={startDate}
                      setDate={setStartDate}
                      className="w-full"
                      placeholder="Select start date"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <DatePicker
                      date={endDate}
                      setDate={setEndDate}
                      className="w-full"
                      placeholder="Select end date"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    placeholder="Filter by company name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex flex-wrap gap-2">
                    {['Applied', 'Interview', 'Offer', 'Rejected', 'Declined'].map((status) => (
                      <Badge
                        key={status}
                        variant={selectedStatuses.includes(status) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => handleStatusChange(status)}
                      >
                        {status}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Include Options</Label>
                  <div className="flex space-x-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="scheduleIncludeNotes" 
                        checked={includeNotes} 
                        onCheckedChange={(checked) => setIncludeNotes(!!checked)} 
                      />
                      <Label htmlFor="scheduleIncludeNotes" className="text-sm font-normal">Include Notes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="scheduleIncludeTasks" 
                        checked={includeTasks} 
                        onCheckedChange={(checked) => setIncludeTasks(!!checked)} 
                      />
                      <Label htmlFor="scheduleIncludeTasks" className="text-sm font-normal">Include Tasks</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Export Name</Label>
                  <Input
                    placeholder="Name of export file"
                    value={exportName}
                    onChange={(e) => setExportName(e.target.value)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={handleClose}>Cancel</Button>
                <Button 
                  onClick={handleScheduleExport} 
                  disabled={isLoading}
                  className="relative overflow-hidden"
                >
                  {isLoading ? 'Scheduling...' : 'Schedule Export'}
                  <motion.div 
                    className="absolute inset-0 bg-primary/10" 
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  />
                </Button>
              </DialogFooter>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
