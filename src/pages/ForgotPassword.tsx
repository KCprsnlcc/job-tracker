import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { KeyRound, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import shadcn/ui components
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isResetEmailSent, setIsResetEmailSent] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      setError(null);
      setLoading(true);
      const { error } = await resetPassword(email);
      
      if (error) throw error;
      
      setResetEmail(email);
      setIsResetEmailSent(true);
      setSuccessMessage(
        'Password reset link sent! Please check your email.'
      );
    } catch (err: any) {
      setError(err.message || 'Failed to send password reset email');
    } finally {
      setLoading(false);
    }
  };

  // Render reset email sent state
  if (isResetEmailSent) {
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
          <motion.div
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="w-full overflow-hidden hover:shadow-md transition-all duration-300 border-primary/10">
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
                <KeyRound className="h-6 w-6 text-primary" />
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <CardTitle className="text-2xl font-bold text-center">Check Your Email</CardTitle>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <CardDescription className="text-center">
                We've sent a password reset link to your email
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
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h3 className="text-lg font-medium">Check your inbox</h3>
              <p className="text-muted-foreground max-w-sm">
                We've sent a password reset link to <motion.span 
                  className="font-medium"
                  initial={{ color: "#000" }}
                  animate={{ color: ["#000", "var(--primary)", "#000"] }}
                  transition={{ duration: 2, repeat: 2, repeatType: "reverse" }}
                >{resetEmail}</motion.span>.
                Click the link in the email to reset your password.
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
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
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
                      Resend Reset Link
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
          
          <CardFooter className="flex flex-col items-center">
            <motion.div 
              className="mt-4 text-center text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              Remember your password?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
              <br />
              <Link to="/privacy-policy" className="text-xs text-muted-foreground hover:underline">
                Privacy Policy
              </Link>
            </motion.div>
          </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  // Render forgot password form
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
        <motion.div
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card className="w-full overflow-hidden hover:shadow-md transition-all duration-300 border-primary/10">
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
              <KeyRound className="h-6 w-6 text-primary" />
            </motion.div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <CardDescription className="text-center">
              Enter your email and we'll send you a password reset link
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
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
                      Sending...
                    </span>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col items-center">
          <motion.div 
            className="mt-4 text-center text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            Remember your password?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
            <br />
            <Link to="/privacy-policy" className="text-xs text-muted-foreground hover:underline">
              Privacy Policy
            </Link>
          </motion.div>
        </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPassword;
