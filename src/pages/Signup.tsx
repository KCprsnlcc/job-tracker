import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, RefreshCw } from 'lucide-react';

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
      const { error, data, isConfirmed } = await signUp(email, password);
      
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
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Verify Your Email</CardTitle>
            <CardDescription className="text-center">
              We've sent a verification link to your email
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center text-center space-y-6">
            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive p-3 w-full">
                <div className="text-sm text-destructive">{error}</div>
              </div>
            )}
            
            {successMessage && (
              <div className="rounded-md bg-green-100 border border-green-400 p-3 w-full">
                <div className="text-sm text-green-800">{successMessage}</div>
              </div>
            )}
            
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Check your inbox</h3>
              <p className="text-muted-foreground max-w-sm">
                We've sent a verification email to <span className="font-medium">{registeredEmail}</span>.
                Click the link in the email to verify your account.
              </p>
            </div>
            
            <div className="space-y-2 pt-4 w-full">
              <p className="text-sm text-muted-foreground">Didn't receive the email?</p>
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={handleResendVerification}
                disabled={resendLoading}
              >
                {resendLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Resend Verification Email
                  </span>
                )}
              </Button>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col items-center border-t pt-6">
            <p className="text-sm text-muted-foreground">
              Already verified?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Render sign up form
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">
            Enter your details to create a new account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive p-3">
                <div className="text-sm text-destructive">{error}</div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full mt-2" 
              disabled={loading}
            >
              {loading ? 'Signing up...' : 'Sign up'}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground mt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
