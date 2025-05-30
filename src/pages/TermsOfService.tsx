import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { 
  ShieldCheck, FileText, Scale, AlertTriangle, Users, Mail, 
  Info, Clock, FileLock, Edit3, Server, Ban, MonitorSmartphone, 
  Globe, Lock, CreditCard 
} from 'lucide-react';
import Footer from '../components/Footer';
import { ThemeToggle } from '../components/theme-toggle';
import { Button } from '../components/ui/button';

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

const TermsOfService: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
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
      {/* Global Header - with mobile support */}
      <motion.header 
        className="bg-card border-b border-border sticky top-0 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
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
                  to="/terms-of-service"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Terms of Service
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
            
            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <Button 
                variant="ghost" 
                className="p-2" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </Button>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <motion.div 
              className="md:hidden pt-2 pb-4 space-y-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Link
                to="/privacy-policy"
                className="block px-2 py-2 text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-of-service"
                className="block px-2 py-2 text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                to="/contact"
                className="block px-2 py-2 text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Contact
              </Link>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" asChild className="w-full">
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </div>
            </motion.div>
          )}
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
            Terms of Service
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Please read these terms carefully before using our service.
          </motion.p>
        </motion.div>
      </section>

      <main className="flex-grow container mx-auto max-w-4xl p-6 md:p-10">
        <Section title="Agreement to Terms" icon={<Scale size={28} />}>
          <p>
            By accessing or using Job Tracker ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these Terms, you do not have permission to access the Service.
          </p>
          <p>
            We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
          </p>
        </Section>

        <Section title="Account Registration" icon={<Users size={28} />}>
          <p>
            To use certain features of the Service, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </p>
          <p>
            You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.
          </p>
          <p>
            We reserve the right to terminate or suspend your account at any time for any reason, including, without limitation, if we suspect that your account information is inaccurate or you have violated these Terms.
          </p>
        </Section>

        <Section title="Acceptable Use" icon={<ShieldCheck size={28} />}>
          <p>
            You agree not to use the Service:
          </p>
          <motion.ul className="list-disc list-inside pl-4 space-y-1 mt-2">
            {[
              "In any way that violates any applicable local, state, national, or international law or regulation.",
              "To transmit, or procure the sending of, any advertising or promotional material, including any junk mail, chain letter, spam, or any other similar solicitation.",
              "To impersonate or attempt to impersonate Job Tracker, a Job Tracker employee, another user, or any other person or entity.",
              "To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which may harm Job Tracker or users of the Service.",
              "To use the Service in a manner that could disable, overburden, damage, or impair the Service."
            ].map((item, i) => (
              <motion.li key={i} custom={i} variants={listItemVariants} initial="hidden" animate="visible">
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </Section>

        <Section title="User Content" icon={<FileText size={28} />}>
          <p>
            The Service allows you to post, link, store, share and otherwise make available certain information, text, or other material ("User Content"). You are responsible for the User Content that you post, including its legality, reliability, and appropriateness.
          </p>
          <p>
            By posting User Content, you grant us the right to use, modify, publicly perform, publicly display, reproduce, and distribute such content on and through the Service. You retain any and all of your rights to any User Content you submit, post, or display on or through the Service and you are responsible for protecting those rights.
          </p>
        </Section>

        <Section title="Intellectual Property" icon={<Lock size={28} />}>
          <p>
            The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of Job Tracker and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
          </p>
          <p>
            Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Job Tracker.
          </p>
        </Section>

        <Section title="Termination" icon={<Ban size={28} />}>
          <p>
            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
          </p>
          <p>
            If you wish to terminate your account, you may simply discontinue using the Service, or you may contact us to request account deletion.
          </p>
          <p>
            All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
          </p>
        </Section>

        <Section title="Disclaimer" icon={<AlertTriangle size={28} />}>
          <p>
            Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
          </p>
          <p>
            Job Tracker does not warrant that: (a) the Service will function uninterrupted, secure, or available at any particular time or location; (b) any errors or defects will be corrected; (c) the Service is free of viruses or other harmful components; or (d) the results of using the Service will meet your requirements.
          </p>
        </Section>

        <Section title="Limitation of Liability" icon={<AlertTriangle size={28} />}>
          <p>
            In no event shall Job Tracker, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from: (a) your access to or use of or inability to access or use the Service; (b) any conduct or content of any third party on the Service; (c) any content obtained from the Service; and (d) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage.
          </p>
        </Section>

        <Section title="Indemnification" icon={<Scale size={28} />}>
          <p>
            You agree to defend, indemnify, and hold harmless Job Tracker and its licensee and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of: (a) your use and access of the Service; (b) a breach of these Terms; or (c) your violation of any third-party right, including without limitation any copyright, property, or privacy right.
          </p>
        </Section>

        <Section title="Governing Law" icon={<Globe size={28} />}>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
          </p>
          <p>
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
          </p>
        </Section>

        <Section title="Changes to the Service" icon={<MonitorSmartphone size={28} />}>
          <p>
            We reserve the right to withdraw or amend our Service, and any service or material we provide via the Service, in our sole discretion without notice. We will not be liable if for any reason all or any part of the Service is unavailable at any time or for any period.
          </p>
        </Section>

        <Section title="Free Service" icon={<CreditCard size={28} />}>
          <p>
            Job Tracker is currently provided as a free service. We do not have any subscription plans or paid tiers at this time. If this changes in the future, we will update these Terms and provide clear notice before implementing any payment system.
          </p>
        </Section>

        <Section title="Third Party Services" icon={<Server size={28} />}>
          <p>
            The Service may contain links to third-party websites or services that are not owned or controlled by Job Tracker. Job Tracker has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
          </p>
          <p>
            You acknowledge and agree that Job Tracker shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.
          </p>
        </Section>

        <Section title="Contact Information" icon={<Mail size={28} />}>
          <p>
            If you have any questions about these Terms, please contact us:
          </p>
          <motion.ul className="list-none pl-0 space-y-1 mt-2">
            <motion.li custom={15} variants={listItemVariants} initial="hidden" animate="visible">
              By email: <a href="mailto:kcpersonalacc@gmail.com" className="text-primary hover:underline">kcpersonalacc@gmail.com</a>
            </motion.li>
            <motion.li custom={16} variants={listItemVariants} initial="hidden" animate="visible">
              By visiting our <Link to="/contact" className="text-primary hover:underline">Contact Page</Link>
            </motion.li>
          </motion.ul>
        </Section>

        <Section title="Effective Date" icon={<Clock size={28} />}>
          <p className="mt-2">
            <em>These Terms of Service are effective as of May 30, 2025.</em>
          </p>
        </Section>
      </main>

      <Footer />
    </motion.div>
  );
};

export default TermsOfService;
