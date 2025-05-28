import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/theme-toggle';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Briefcase, CheckCircle, Clock, LineChart, ShieldCheck } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header - Matching dashboard style */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <img src="/favicon.ico" alt="Job Tracker" className="w-6 h-6" />
            Job Tracker
          </h1>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="py-12 md:py-20 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Track Your Job Applications <span className="text-primary">Effortlessly</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Keep track of all your job applications in one place. Never lose track of where you applied and what stage each application is in.
              </p>
              <div className="flex gap-4">
                <Button size="lg" asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="relative p-2 bg-background rounded-lg border border-border shadow-lg">
                <img 
                  src="/dashboard-preview.png" 
                  alt="Dashboard Preview" 
                  className="rounded border border-border shadow-sm"
                  onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/600x400/3b82f6/ffffff?text=Job+Tracker+Dashboard";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Features</h2>
            <p className="text-muted-foreground mt-2">Everything you need to manage your job search</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Briefcase className="h-8 w-8 text-primary" />}
              title="Application Tracking"
              description="Keep all your job applications organized in one place with detailed information."
            />
            <FeatureCard 
              icon={<Clock className="h-8 w-8 text-primary" />}
              title="Status Updates"
              description="Track the status of each application from applied to offer received."
            />
            <FeatureCard 
              icon={<LineChart className="h-8 w-8 text-primary" />}
              title="Progress Analytics"
              description="Get insights into your job search with statistics and trends."
            />
            <FeatureCard 
              icon={<CheckCircle className="h-8 w-8 text-primary" />}
              title="Task Management"
              description="Set reminders for follow-ups and never miss important deadlines."
            />
            <FeatureCard 
              icon={<ShieldCheck className="h-8 w-8 text-primary" />}
              title="Secure Storage"
              description="Your data is encrypted and stored securely with our cloud-based solution."
            />
            <Card className="p-6 flex flex-col items-center text-center space-y-3 border-dashed border-2 border-primary/40">
              <h3 className="text-xl font-medium">And More!</h3>
              <p className="text-muted-foreground">Sign up today to explore all features</p>
              <Button variant="secondary" asChild className="mt-2">
                <Link to="/signup">Get Started</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-12 bg-primary/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to streamline your job search?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Join thousands of job seekers who are organizing their applications with Job Tracker.
          </p>
          <Button size="lg" asChild>
            <Link to="/signup">Create Free Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer - Reusing the same footer */}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

// Feature card component
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <Card className="p-6 flex flex-col items-center text-center space-y-3">
      <div className="mb-2">{icon}</div>
      <h3 className="text-xl font-medium">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
};

export default LandingPage;
