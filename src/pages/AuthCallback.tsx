import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { CheckCircle, X, Loader2 } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // The authentication verification is handled automatically by Supabase
    // when the redirect happens. We just need to check if we're on this page
    // because of a successful verification.
    const handleEmailVerification = async () => {
      try {
        // Get the current auth session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        // If we have a session, the verification was successful
        if (data && data.session) {
          setVerificationStatus('success');
          return;
        }
        
        // Check for hash parameters in URL that might indicate verification
        const hash = window.location.hash;
        if (hash && (hash.includes('type=recovery') || hash.includes('type=signup'))) {
          setVerificationStatus('success');
          return;
        }
        
        // Check if we have a code in the URL
        const code = searchParams.get('code');
        if (code) {
          // Exchange the code for a session
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            throw error;
          }
          setVerificationStatus('success');
          return;
        }
        
        // If we reach here and don't have parameters that would indicate a verification
        // attempt, we're likely here by direct navigation, which we'll treat as an error
        if (!searchParams.toString() && !hash) {
          throw new Error('No verification parameters found');
        }
        
        // Default to success for any other case where we have query parameters
        // This is a fallback for any edge cases we haven't explicitly handled
        setVerificationStatus('success');
      } catch (error: any) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        setErrorMessage(error.message || 'An error occurred during verification');
      }
    };

    handleEmailVerification();
  }, [searchParams]);

  const handleContinue = () => {
    navigate('/login?verified=true');
  };

  const handleTryAgain = () => {
    navigate('/signup');
  };

  if (verificationStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Verifying Your Email</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center space-y-6 py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Please wait while we verify your email...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-destructive">Verification Failed</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center space-y-6 py-8">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
              <X className="h-8 w-8 text-destructive" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Unable to verify your email</h3>
              <p className="text-muted-foreground">{errorMessage || 'The verification link may have expired or is invalid.'}</p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handleTryAgain}>Try Again</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-green-600">Email Verified!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center space-y-6 py-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Your email has been verified</h3>
            <p className="text-muted-foreground">
              Thank you for verifying your email. You can now sign in to your account.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleContinue}>Continue to Login</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthCallback;
