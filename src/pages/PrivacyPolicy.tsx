import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ShieldCheck, FileText, DatabaseZap, Cookie, Link2, Users, Mail, Info, Clock, FileLock, Edit3, AlertTriangle } from 'lucide-react';
import Footer from '../components/Footer'; // Assuming you have a Footer component
import { ThemeToggle } from '../components/theme-toggle'; // Added for global header
import { Button } from '../components/ui/button'; // Added for global header

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

const PrivacyPolicy: React.FC = () => {
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
      {/* Global Header from LandingPage.tsx */}
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
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Job Tracker
            </Link>
          </motion.h1>
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm hidden md:block" // Hide on small screens if needed
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
              className="text-sm hidden md:block" // Hide on small screens if needed
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
            Privacy Policy & Terms of Service
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Your trust is important to us. Please read our policies carefully.
          </motion.p>
        </motion.div>
      </section>

      <main className="flex-grow container mx-auto max-w-4xl p-6 md:p-10">
        <Section title="Introduction" icon={<Info size={28} />}>
          <p>
            Welcome to Job Tracker ("us", "we", or "our")! We are committed to protecting your personal information and your right to privacy. This Privacy Policy applies to all information collected through our application (the "Service"), as well as any related services, sales, marketing or events.
          </p>
          <p>
            By using our Service, you agree to the collection and use of information in accordance with this policy. If you have any questions or concerns about this privacy notice, or our practices with regards to your personal information, please contact us using the details provided below.
          </p>
        </Section>

        <Section title="Information We Collect" icon={<FileText size={28} />}>
          <p>
            We collect personal information that you voluntarily provide to us when you register on the Service, express an interest in obtaining information about us or our products and services, when you participate in activities on the Service or otherwise when you contact us.
          </p>
          <p>
            The personal information that we collect depends on the context of your interactions with us and the Service, the choices you make and the products and features you use. The personal information we collect may include:
          </p>
          <motion.ul className="list-disc list-inside pl-4 space-y-1 mt-2">
            {[
              "Personal Identification Information: Name, email address, etc.",
              "Account Credentials: Usernames, passwords (hashed), and similar security information used for authentication and account access.",
              "Job Application Data: Information you input about job applications, such as company names, job titles, application status, notes, and related documents you might upload (if applicable).",
              "Usage Data: Information on how you use the Service, such as features accessed, time spent, and interaction patterns.",
              "Device and Technical Data: IP address, browser type, operating system, device identifiers (if applicable)."
            ].map((item, i) => (
              <motion.li key={i} custom={i} variants={listItemVariants} initial="hidden" animate="visible">
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </Section>

        <Section title="How We Use Your Information" icon={<DatabaseZap size={28} />}>
          <p>
            We use personal information collected via our Service for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>
          <motion.ul className="list-disc list-inside pl-4 space-y-1 mt-2">
            {[
              "To facilitate account creation and logon process.",
              "To manage user accounts and provide customer support.",
              "To send administrative information to you, such as information regarding changes to our terms, conditions, and policies.",
              "To personalize and improve your experience on our Service.",
              "To monitor and analyze usage and trends to improve our Service.",
              "For security purposes, to prevent fraud and ensure the safety of our users.",
              "To respond to legal requests and prevent harm."
            ].map((item, i) => (
              <motion.li key={i} custom={i + 5} variants={listItemVariants} initial="hidden" animate="visible">
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </Section>

        <Section title="Sharing Your Information" icon={<Users size={28} />}>
          <p>
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may share your data with third-party vendors, service providers, contractors or agents who perform services for us or on our behalf and require access to such information to do that work. Examples include: data analytics, email delivery, hosting services, and customer service.
          </p>
          <p>
            We do not sell your personal information. We may also disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.
          </p>
        </Section>

        <Section title="Data Security" icon={<ShieldCheck size={28} />}>
          <p>
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. This includes using Supabase for authentication and database services, which provides robust security features. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure. We cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Service is at your own risk.
          </p>
        </Section>

        <Section title="Data Retention" icon={<Clock size={28} />}>
          <p>
            We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy policy, unless a longer retention period is required or permitted by law (such as tax, accounting or other legal requirements). When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize it, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible.
          </p>
        </Section>

        <Section title="Cookies and Tracking Technologies" icon={<Cookie size={28} />}>
          <p>
            We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Policy (if applicable, or can be detailed here). For now, we primarily use essential cookies for session management and authentication through Supabase.
          </p>
        </Section>

        <Section title="Third-Party Websites" icon={<Link2 size={28} />}>
          <p>
            The Service may contain links to third-party websites or services that are not owned or controlled by us. We are not responsible for the privacy practices or the content of these third-party websites. We encourage you to review the privacy policies of any third-party websites you visit.
          </p>
        </Section>

        <Section title="Children's Privacy" icon={<Users size={28} />}> {/* Consider a more specific icon if available, e.g., 'child' or 'no-infants' */}
          <p>
            Our Service is not intended for use by children under the age of 13 (or 16 in some jurisdictions). We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child without verification of parental consent, we take steps to remove that information from our servers.
          </p>
        </Section>

        <Section title="Your Privacy Rights" icon={<FileLock size={28} />}>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, subject to local data protection laws. These may include the right to:
          </p>
          <motion.ul className="list-disc list-inside pl-4 space-y-1 mt-2">
            {[
              "Access your personal information.",
              "Request correction of your personal information.",
              "Request erasure of your personal information.",
              "Object to processing of your personal information.",
              "Request restriction of processing your personal information.",
              "Request data portability.",
              "Withdraw consent (if processing is based on consent)."
            ].map((item, i) => (
              <motion.li key={i} custom={i + 10} variants={listItemVariants} initial="hidden" animate="visible">
                {item}
              </motion.li>
            ))}
          </motion.ul>
          <p className="mt-3">
            To exercise these rights, please contact us using the contact information provided below. We will respond to your request in accordance with applicable data protection laws.
          </p>
        </Section>

        <Section title="Updates to This Policy" icon={<Edit3 size={28} />}>
          <p>
            We may update this privacy policy from time to time. The updated version will be indicated by an updated "Last updated" date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy policy, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy policy frequently to be informed of how we are protecting your information.
          </p>
          <p className="mt-2 text-sm">
            <em>Last updated: [Specify Date - e.g., May 29, 2025]</em>
          </p>
        </Section>

        <Section title="Terms of Service Summary" icon={<FileText size={28} />}>
          <p>
            By using Job Tracker, you also agree to our Terms of Service. A brief summary includes:
          </p>
          <motion.ul className="list-disc list-inside pl-4 space-y-1 mt-2">
            {[
              "Acceptance of Terms: By accessing or using the Service, you agree to be bound by these Terms.",
              "User Accounts: You are responsible for safeguarding your account and for any activities or actions under your account.",
              "User Conduct: You agree not to use the Service for any unlawful purpose or in any way that might harm, damage, or disparage any other party.",
              "Intellectual Property: The Service and its original content, features, and functionality are and will remain the exclusive property of Job Tracker and its licensors.",
              "Termination: We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.",
              "Limitation of Liability: Our liability is limited to the maximum extent permitted by law.",
              "Governing Law: These Terms shall be governed by the laws of [Specify Jurisdiction - e.g., California, USA], without regard to its conflict of law provisions."
            ].map((item, i) => (
              <motion.li key={i} custom={i + 15} variants={listItemVariants} initial="hidden" animate="visible">
                {item}
              </motion.li>
            ))}
          </motion.ul>
          <p className="mt-3">
            This is a summary. For the full Terms of Service, please visit [Link to Full ToS Page - e.g., /terms-of-service] or contact us.
          </p>
        </Section>

        <Section title="Contact Us" icon={<Mail size={28} />}>
          <p>
            If you have any questions about this Privacy Policy or our Terms of Service, please contact us:
          </p>
          <motion.ul className="list-none pl-0 space-y-1 mt-2">
            <motion.li custom={22} variants={listItemVariants} initial="hidden" animate="visible">
              By email: <a href="mailto:kcpersonalacc@gmail.com" className="text-primary hover:underline">kcpersonalacc@gmail.com</a>
            </motion.li>
            <motion.li custom={23} variants={listItemVariants} initial="hidden" animate="visible">
              By visiting this page on our website (if applicable): <Link to="/contact" className="text-primary hover:underline">Contact Page</Link>
            </motion.li>
            {/* Add other contact methods if available, e.g., address */}
          </motion.ul>
        </Section>

        {/* Placeholder for Back to Top or other utility components if needed */}

      </main>

      <Footer />
    </motion.div>
  );
};

export default PrivacyPolicy;
