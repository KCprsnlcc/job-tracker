import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, RefreshCw, UserPlus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import shadcn/ui components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const Signup: React.FC = () => {
  const { signUp, resendVerificationEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setError(null);
      setLoading(true);
      const { error, isConfirmed } = await signUp(email, password);
      
      if (error) throw error;
      
      setRegisteredEmail(email);
      setIsVerificationSent(true);
      
      if (isConfirmed) {
        setSuccessMessage('Your account already exists. Please check your email for a verification link or sign in.');
      } else {
        setSuccessMessage(
          'Sign up successful! Please check your email for a verification link.'
        );
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };
  
  const handleResendVerification = async () => {
    if (!registeredEmail) return;
    
    try {
      setResendLoading(true);
      setError(null);
      setSuccessMessage(null); // Clear any existing success message
      
      const { error } = await resendVerificationEmail(registeredEmail);
      
      if (error) {
        // Check for specific error types
        if (error.message?.includes('Email rate limit exceeded')) {
          throw new Error('Too many email requests. Please wait a moment before trying again.');
        }
        throw error;
      }
      
      // Show success message with a timestamp to make it clear it's a new message
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      setSuccessMessage(`Verification email resent at ${timeString}! Please check your inbox.`);
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setResendLoading(false);
    }
  };

  // Render verification sent state
  if (isVerificationSent) {
    return (
      <motion.div 
        className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          <Card className="max-w-md w-full overflow-hidden">
          <CardHeader className="space-y-1">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <CardDescription className="text-center">
                We've sent a verification link to your email
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="flex flex-col items-center text-center space-y-6">
            <AnimatePresence>
              {error && (
                <motion.div 
                  className="rounded-md bg-destructive/10 border border-destructive p-3 w-full"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-sm text-destructive">{error}</div>
                </motion.div>
              )}
              
              {successMessage && (
                <motion.div 
                  className="rounded-md bg-green-100 border border-green-400 p-3 w-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-sm text-green-800">{successMessage}</div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div 
              className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, 0] }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <Mail className="h-8 w-8 text-primary" />
            </motion.div>
            
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="text-lg font-medium">Check your inbox</h3>
              <p className="text-muted-foreground max-w-sm">
                We've sent a verification email to <motion.span 
                  className="font-medium"
                  initial={{ color: "#000" }}
                  animate={{ color: ["#000", "var(--primary)", "#000"] }}
                  transition={{ duration: 2, repeat: 2, repeatType: "reverse" }}
                >{registeredEmail}</motion.span>.
                Click the link in the email to verify your account.
              </p>
            </motion.div>
            
            <motion.div 
              className="space-y-2 pt-4 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <p className="text-sm text-muted-foreground">Didn't receive the email?</p>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 w-full relative overflow-hidden group" 
                  onClick={handleResendVerification}
                  disabled={resendLoading}
                >
                  {resendLoading ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </motion.div>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Resend Verification Email
                    </span>
                  )}
                  <motion.div 
                    className="absolute inset-0 bg-primary/10" 
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
          
          <CardFooter className="flex flex-col items-center border-t pt-6">
            <motion.p 
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              Already verified?{' '}
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="inline-block"
              >
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </motion.span>
            </motion.p>
          </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    );
  }

  // Render sign up form
  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="max-w-md w-full"
      >
        <Card className="max-w-md w-full overflow-hidden">
        <CardHeader className="space-y-1">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center mb-2"
          >
            <motion.div 
              className="p-2 rounded-full bg-primary/10"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <UserPlus className="h-6 w-6 text-primary" />
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <CardDescription className="text-center">
              Enter your details to create a new account
            </CardDescription>
          </motion.div>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <AnimatePresence>
              {error && (
                <motion.div 
                  className="rounded-md bg-destructive/10 border border-destructive p-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-sm text-destructive">{error}</div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
              />
            </motion.div>
            
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
              />
            </motion.div>

            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-2"
            >
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  type="submit" 
                  className="w-full relative overflow-hidden group" 
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </motion.div>
                      Signing up...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Sign up
                      <motion.div 
                        animate={{ x: [0, 5, 0] }} 
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </span>
                  )}
                  <motion.div 
                    className="absolute inset-0 bg-white/20" 
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                </Button>
              </motion.div>
            </motion.div>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col items-center">
          <motion.p 
            className="text-sm text-muted-foreground mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            Already have an account?{' '}
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="inline-block"
            >
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </motion.span>
          </motion.p>
        </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Signup;
