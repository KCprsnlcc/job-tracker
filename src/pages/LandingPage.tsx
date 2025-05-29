import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/theme-toggle';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Briefcase, CheckCircle, Clock, LineChart, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform, useInView, useAnimation } from 'framer-motion';

const LandingPage: React.FC = () => {
  // For parallax scrolling effect on hero image
  const { scrollY } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
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
            Job Tracker
          </motion.h1>
          <div className="flex items-center space-x-4">
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

      {/* Hero section with animations */}
      <section className="py-12 md:py-20 bg-primary/5 overflow-hidden" ref={heroRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <motion.div 
              className="flex-1 space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold tracking-tight"
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
                className="text-lg text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Keep track of all your job applications in one place. Never lose track of where you applied and what stage each application is in.
              </motion.p>
              <motion.div 
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" asChild>
                    <Link to="/signup" className="flex items-center gap-2">
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
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div 
              className="flex-1 max-w-md"
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
                  className="rounded border border-border shadow-sm"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/600x400/3b82f6/ffffff?text=Job+Tracker+Dashboard";
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features section with animations */}
      <motion.section 
        className="py-16 bg-background"
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
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2 
              className="text-3xl font-bold"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >Features</motion.h2>
            <motion.p 
              className="text-muted-foreground mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >Everything you need to manage your job search</motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2
                }
              }
            }}
          >
            <AnimatedFeatureCard 
              icon={<Briefcase className="h-8 w-8 text-primary" />}
              title="Application Tracking"
              description="Keep all your job applications organized in one place with detailed information."
              delay={0}
            />
            <AnimatedFeatureCard 
              icon={<Clock className="h-8 w-8 text-primary" />}
              title="Status Updates"
              description="Track the status of each application from applied to offer received."
              delay={0.2}
            />
            <AnimatedFeatureCard 
              icon={<LineChart className="h-8 w-8 text-primary" />}
              title="Progress Analytics"
              description="Get insights into your job search with statistics and trends."
              delay={0.4}
            />
            <AnimatedFeatureCard 
              icon={<CheckCircle className="h-8 w-8 text-primary" />}
              title="Task Management"
              description="Set reminders for follow-ups and never miss important deadlines."
              delay={0.6}
            />
            <AnimatedFeatureCard 
              icon={<ShieldCheck className="h-8 w-8 text-primary" />}
              title="Secure Storage"
              description="Your data is encrypted and stored securely with our cloud-based solution."
              delay={0.8}
            />
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 1 } }
              }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <Card className="p-6 flex flex-col items-center text-center space-y-3 border-dashed border-2 border-primary/40 h-full">
                <h3 className="text-xl font-medium">And More!</h3>
                <p className="text-muted-foreground">Sign up today to explore all features</p>
                <motion.div 
                  whileHover={{ scale: 1.05 }} 
                  whileTap={{ scale: 0.95 }}
                  className="mt-2"
                >
                  <Button variant="secondary" asChild>
                    <Link to="/signup">Get Started</Link>
                  </Button>
                </motion.div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA section with animations */}
      <motion.section 
        className="py-12 bg-primary/10"
        ref={ctaRef}
        initial="hidden"
        animate={ctaControls}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration: 0.5 } }
        }}
      >
        <motion.div 
          className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-3xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >Ready to maximize your job search?</motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Join thousands of job seekers who are organizing their applications with Job Tracker.
          </motion.p>
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Button size="lg" asChild className="relative overflow-hidden group">
              <Link to="/signup" className="flex items-center gap-2">
                Create Free Account
                <motion.div 
                  animate={{ x: [0, 5, 0] }} 
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
                <motion.div 
                  className="absolute inset-0 bg-white/20" 
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Footer - Reusing the same footer */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

// Animated Feature card component
const AnimatedFeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}> = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay } }
      }}
      whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
    >
      <Card className="p-6 flex flex-col items-center text-center space-y-3 h-full">
        <motion.div 
          className="mb-2"
          whileHover={{ scale: 1.2, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {icon}
        </motion.div>
        <h3 className="text-xl font-medium">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </Card>
    </motion.div>
  );
};



export default LandingPage;
