import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Phone, Send, MessageSquare, Info, CheckCircle, AlertCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import Footer from '../components/Footer';
import { ThemeToggle } from '../components/theme-toggle';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

const Section: React.FC<{
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, icon, children, className }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`mb-10 p-6 bg-card/50 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${className}`}
    >
      <div className="flex items-center mb-4">
        {icon && <div className="mr-3 text-primary flex-shrink-0">{icon}</div>}
        <h2 className="text-2xl md:text-3xl font-semibold text-primary">{title}</h2>
      </div>
      <div className="text-muted-foreground space-y-3 leading-relaxed">
        {children}
      </div>
    </motion.section>
  );
};

const Contact: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const fieldName = e.target.name;
    // Map EmailJS field names to state property names
    const stateMapping: Record<string, string> = {
      'user_name': 'name',
      'user_email': 'email',
      'subject': 'subject', 
      'message': 'message'
    };
    
    // Update the corresponding state property based on mapping
    const stateField = stateMapping[fieldName] || fieldName;
    
    setFormState({
      ...formState,
      [stateField]: e.target.value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    // Use EmailJS to actually send the email
    emailjs.sendForm(
      'service_nba9yhh', // You'll get this from EmailJS dashboard
      'template_64vtr1k', // You'll get this from EmailJS dashboard
      formRef.current as HTMLFormElement,
      'vl-PwUUHY2QzZDlfj' // You'll get this from EmailJS dashboard
    )
      .then((result) => {
        console.log('Email successfully sent!', result.text);
        setFormStatus('success');
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormState({
            name: '',
            email: '',
            subject: '',
            message: ''
          });
          setFormStatus('idle');
        }, 3000);
      })
      .catch((error) => {
        console.error('Failed to send email:', error.text);
        setFormStatus('error');
      });
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const formItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      },
    }),
  };

  const contactInfoVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1 + 0.3,
        duration: 0.5,
        ease: "easeOut"
      },
    }),
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="min-h-screen bg-background text-foreground flex flex-col"
    >
      {/* Global Header - same as LandingPage.tsx and PrivacyPolicy.tsx */}
      <motion.header 
        className="bg-card border-b border-border sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.h1 
            className="text-2xl font-bold flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.img 
              src="/favicon.ico" 
              alt="Job Tracker" 
              className="w-6 h-6" 
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: 0, ease: "easeInOut" }}
            />
            <Link to="/" className="text-primary hover:text-primary/80 transition-colors">
              Job Tracker
            </Link>
          </motion.h1>
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm hidden md:block"
            >
              <Link
                to="/privacy-policy"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Privacy Policy
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm hidden md:block"
            >
              <Link
                to="/contact"
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Contact
              </Link>
            </motion.div>
            <ThemeToggle />
            <div className="flex gap-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Page Title Section */}
      <section className="py-12 md:py-20 bg-primary/5 text-center">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 100 }}
          >
            Contact Us
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </motion.p>
        </motion.div>
      </section>

      <main className="flex-grow container mx-auto max-w-5xl p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Contact Form Section */}
          <Section title="Send a Message" icon={<MessageSquare size={28} />} className="md:order-2">
            <motion.form 
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <AnimatePresence mode="wait">
                {formStatus === 'success' && (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-md bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 flex items-center mb-4"
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    <span>Message sent successfully! We'll get back to you soon.</span>
                  </motion.div>
                )}
                
                {formStatus === 'error' && (
                  <motion.div 
                    key="error"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-md bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex items-center mb-4"
                  >
                    <AlertCircle className="mr-2 h-5 w-5" />
                    <span>There was an error sending your message. Please try again.</span>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div custom={0} variants={formItemVariants} initial="hidden" animate="visible">
                <Label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</Label>
                <Input 
                  id="name"
                  name="user_name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className="w-full"
                  required
                />
              </motion.div>
              
              <motion.div custom={1} variants={formItemVariants} initial="hidden" animate="visible">
                <Label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</Label>
                <Input 
                  id="email"
                  name="user_email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full"
                  required
                />
              </motion.div>
              
              <motion.div custom={2} variants={formItemVariants} initial="hidden" animate="visible">
                <Label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</Label>
                <Input 
                  id="subject"
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  className="w-full"
                  required
                />
              </motion.div>
              
              <motion.div custom={3} variants={formItemVariants} initial="hidden" animate="visible">
                <Label htmlFor="message" className="block text-sm font-medium mb-1">Message</Label>
                <Textarea 
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="Your message..."
                  className="w-full h-32"
                  required
                />
              </motion.div>
              
              <motion.div 
                custom={4} 
                variants={formItemVariants} 
                initial="hidden" 
                animate="visible"
                className="flex justify-end"
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto flex items-center gap-2" 
                    disabled={formStatus === 'submitting'}
                  >
                    {formStatus === 'submitting' ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="h-4 w-4 border-2 border-t-transparent border-white rounded-full"
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <motion.div 
                          animate={{ x: [0, 5, 0] }} 
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        >
                          <Send className="h-4 w-4" />
                        </motion.div>
                      </>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
              
              <motion.p 
                className="text-xs text-muted-foreground text-center mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                All messages are sent directly to kcpersonalacc@gmail.com
              </motion.p>
            </motion.form>
          </Section>
          
          {/* Contact Information Section */}
          <Section title="Contact Information" icon={<Info size={28} />} className="md:order-1">
            <p className="mb-6">
              Have questions or need assistance? Our team is ready to help you with any inquiries related to Job Tracker.
            </p>
            
            <div className="space-y-6">
              <motion.div 
                custom={0} 
                variants={contactInfoVariants} 
                initial="hidden" 
                animate="visible"
                className="flex items-start"
              >
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Email</h3>
                  <p className="text-muted-foreground">kcpersonalacc@gmail.com</p>
                  <p className="text-sm">We'll respond within 24 hours</p>
                </div>
              </motion.div>
              
              <motion.div 
                custom={1} 
                variants={contactInfoVariants} 
                initial="hidden" 
                animate="visible"
                className="flex items-start"
              >
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Phone</h3>
                  <p className="text-muted-foreground">+63 99499 53785</p>
                  <p className="text-sm">Monday-Friday, 9am-5pm EST</p>
                </div>
              </motion.div>
              
              <motion.div 
                custom={2} 
                variants={contactInfoVariants} 
                initial="hidden" 
                animate="visible"
                className="flex items-start"
              >
                <div className="bg-primary/10 p-3 rounded-full mr-4">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Location</h3>
                  <p className="text-muted-foreground">
                    Zamboanga City<br />
                    Zamboanga Del Sur<br />
                    Philippines
                  </p>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="mt-8 p-4 bg-card border border-border rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <h3 className="font-medium text-foreground mb-2">Business Hours</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Monday-Friday:</span>
                <span>9:00 AM - 5:00 PM</span>
                <span className="text-muted-foreground">Saturday:</span>
                <span>10:00 AM - 2:00 PM</span>
                <span className="text-muted-foreground">Sunday:</span>
                <span>Closed</span>
              </div>
            </motion.div>
          </Section>
        </div>
        
        {/* FAQ Section */}
        <Section title="Frequently Asked Questions" icon={<MessageSquare size={28} />}>
          <motion.div 
            className="grid gap-6 md:grid-cols-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <motion.div 
              className="p-4 bg-card border border-border rounded-lg"
              whileHover={{ y: -5, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="font-medium text-foreground mb-2">How secure is my data?</h3>
              <p className="text-sm text-muted-foreground">
                We take security seriously. All data is encrypted and stored securely. We never share your information with third parties without your consent.
              </p>
            </motion.div>
            
            <motion.div 
              className="p-4 bg-card border border-border rounded-lg"
              whileHover={{ y: -5, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="font-medium text-foreground mb-2">Can I export my job application data?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, Job Tracker allows you to export your data in various formats including PDF and CSV for your records or analysis.
              </p>
            </motion.div>
            
            <motion.div 
              className="p-4 bg-card border border-border rounded-lg"
              whileHover={{ y: -5, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="font-medium text-foreground mb-2">Is there a mobile app available?</h3>
              <p className="text-sm text-muted-foreground">
                Currently, Job Tracker is optimized for web browsers on all devices. A dedicated mobile app is in our development roadmap.
              </p>
            </motion.div>
            
            <motion.div 
              className="p-4 bg-card border border-border rounded-lg"
              whileHover={{ y: -5, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="font-medium text-foreground mb-2">Do you offer subscriptions?</h3>
              <p className="text-sm text-muted-foreground">
                No, Job Tracker doesn't have any subscription plans. The service is provided without any recurring payments or subscription requirements.
              </p>
            </motion.div>
          </motion.div>
        </Section>
      </main>
      
      {/* Footer Component */}
      <Footer />
    </motion.div>
  );
};

export default Contact;