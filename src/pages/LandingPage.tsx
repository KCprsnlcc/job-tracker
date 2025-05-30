import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/theme-toggle';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Briefcase, CheckCircle, Clock, LineChart, ShieldCheck, ArrowRight, Menu, X } from 'lucide-react';
import { motion, useScroll, useTransform, useInView, useAnimation } from 'framer-motion';

const LandingPage: React.FC = () => {
  // For parallax scrolling effect on hero image
  const { scrollY } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const featuresInView = useInView(featuresRef, { once: false, amount: 0.2 });
  const ctaInView = useInView(ctaRef, { once: false, amount: 0.5 });
  
  const featuresControls = useAnimation();
  const ctaControls = useAnimation();
  
  // Run animations when sections come into view
  useEffect(() => {
    if (featuresInView) {
      featuresControls.start('visible');
    }
    if (ctaInView) {
      ctaControls.start('visible');
    }
  }, [featuresInView, ctaInView, featuresControls, ctaControls]);
  
  const heroImageY = useTransform(scrollY, [0, 300], [0, 50]);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - Matching dashboard style with animations */}
      <motion.header 
        className="bg-card border-b border-border sticky top-0 z-10"
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
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Job Tracker
            </Link>
          </motion.h1>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm"
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
              className="text-sm"
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
          
          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleMobileMenu}
              className="h-9 w-9"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        <motion.div 
          className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: mobileMenuOpen ? 1 : 0,
            height: mobileMenuOpen ? 'auto' : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 py-3 space-y-3 border-t border-border bg-card/95 backdrop-blur-sm">
            <Link
              to="/privacy-policy"
              className="block py-2 text-muted-foreground hover:text-primary transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Privacy Policy
            </Link>
            <Link
              to="/contact"
              className="block py-2 text-muted-foreground hover:text-primary transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" asChild className="flex-1">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
              </Button>
              <Button asChild className="flex-1">
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.header>

      {/* Hero section with animations - Mobile optimized */}
      <section className="py-8 md:py-20 bg-primary/5 overflow-hidden" ref={heroRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div 
              className="flex-1 space-y-4 md:space-y-6 text-center md:text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h2 
                className="text-3xl md:text-5xl font-bold tracking-tight leading-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Track Your Job Applications <motion.span 
                  className="text-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >Effortlessly</motion.span>
              </motion.h2>
              <motion.p 
                className="text-base md:text-lg text-muted-foreground max-w-md mx-auto md:mx-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Keep track of all your job applications in one place. Never lose track of where you applied and what stage each application is in.
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <motion.div 
                  className="w-full sm:w-auto"
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" asChild className="w-full sm:w-auto">
                    <Link to="/signup" className="flex items-center gap-2 justify-center">
                      Get Started
                      <motion.div 
                        animate={{ x: [0, 5, 0] }} 
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </Link>
                  </Button>
                </motion.div>
                <motion.div 
                  className="w-full sm:w-auto"
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                    <Link to="/login">Login</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div 
              className="flex-1 max-w-sm md:max-w-md mx-auto mt-8 md:mt-0"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{ y: heroImageY }}
            >
              <motion.div 
                className="relative p-2 bg-background rounded-lg border border-border shadow-lg"
                whileHover={{ scale: 1.03, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <img 
                  src="/dashboard-preview.png" 
                  alt="Dashboard Preview" 
                  className="rounded border border-border shadow-sm w-full"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/600x400/3b82f6/ffffff?text=Job+Tracker+Dashboard";
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features section with animations - Mobile optimized */}
      <motion.section 
        className="py-12 md:py-16 bg-background"
        ref={featuresRef}
        initial="hidden"
        animate={featuresControls}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.5 } }
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-10 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className="text-2xl md:text-3xl font-bold mb-3"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              Features Designed for Job Seekers
            </motion.h2>
            <motion.p 
              className="text-muted-foreground max-w-2xl mx-auto"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 0.5, delay: 0.2 } }
              }}
            >
              Our platform provides everything you need to organize and optimize your job search process.
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <AnimatedFeatureCard
              icon={<Briefcase className="h-10 w-10 text-primary" />}
              title="Track Applications"
              description="Keep a record of all your job applications including company, role, and application status."
              delay={0.1}
            />
            <AnimatedFeatureCard
              icon={<Clock className="h-10 w-10 text-primary" />}
              title="Never Miss Deadlines"
              description="Set reminders for interviews, follow-ups, and important application deadlines."
              delay={0.2}
            />
            <AnimatedFeatureCard
              icon={<CheckCircle className="h-10 w-10 text-primary" />}
              title="Task Management"
              description="Create and manage tasks related to your job search process."
              delay={0.3}
            />
            <AnimatedFeatureCard
              icon={<LineChart className="h-10 w-10 text-primary" />}
              title="Visualize Progress"
              description="Get insights into your job search with charts and analytics."
              delay={0.4}
            />
            <AnimatedFeatureCard
              icon={<ShieldCheck className="h-10 w-10 text-primary" />}
              title="Secure & Private"
              description="Your data is encrypted and never shared with third parties."
              delay={0.5}
            />
            <AnimatedFeatureCard
              icon={<ArrowRight className="h-10 w-10 text-primary" />}
              title="Export Options"
              description="Export your application data in multiple formats for external use."
              delay={0.6}
            />
          </div>
        </div>
      </motion.section>

      {/* CTA Section - Mobile optimized */}
      <motion.section 
        className="py-12 md:py-20 bg-primary/5"
        ref={ctaRef}
        initial="hidden"
        animate={ctaControls}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.6 } }
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            className="text-2xl md:text-4xl font-bold mb-4"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
          >
            Ready to Organize Your Job Search?
          </motion.h2>
          <motion.p 
            className="text-muted-foreground mb-8 max-w-2xl mx-auto text-base md:text-lg"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.5, delay: 0.2 } }
            }}
          >
            Join thousands of job seekers who use Job Tracker to streamline their application process.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.4 } }
            }}
          >
            <motion.div 
              className="w-full sm:w-auto"
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link to="/signup">Create Free Account</Link>
              </Button>
            </motion.div>
            <motion.div 
              className="w-full sm:w-auto"
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                <Link to="/login">Sign In</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
};

// Define interface for AnimatedFeatureCard props
interface AnimatedFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

// Animated Feature card component
const AnimatedFeatureCard = ({ icon, title, description, delay = 0 }: AnimatedFeatureCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className="p-6 h-full flex flex-col hover:shadow-md transition-shadow duration-300 border-primary/10">
        <div className="mb-4">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm flex-grow">{description}</p>
      </Card>
    </motion.div>
  );
};

export default LandingPage;
