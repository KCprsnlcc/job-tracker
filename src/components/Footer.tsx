import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-4 px-4 border-t border-border bg-card mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-2 sm:mb-0">
          <span className="text-sm text-muted-foreground">
            Job Tracker™ | Your Application Management Solution
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} | Created by <span className="font-medium">kcprsnlcc</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
