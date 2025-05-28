import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <motion.footer 
      className="py-4 px-4 border-t border-border bg-card mt-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
        <motion.div 
          className="mb-2 sm:mb-0"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <motion.span 
            className="text-sm text-muted-foreground"
            whileHover={{ color: "var(--primary)" }}
            transition={{ duration: 0.2 }}
          >
            Job Tracker™ | Your Application Management Solution
          </motion.span>
        </motion.div>
        <motion.div 
          className="text-sm text-muted-foreground"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          © {new Date().getFullYear()} | Created by <motion.span 
            className="font-medium"
            whileHover={{ color: "var(--primary)" }}
            transition={{ duration: 0.2 }}
          >kcprsnlcc</motion.span>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
