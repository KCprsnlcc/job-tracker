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
    const handleAuthCallback = async () => {
      setVerificationStatus('loading'); // Explicitly set loading at the start
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('Error getting session:', sessionError);
          throw sessionError;
        }

        if (session) {
          setVerificationStatus('success');
          navigate('/dashboard');
          return;
        }

        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const type = hashParams.get('type');
        const code = searchParams.get('code');

        if (type === 'recovery' || type === 'signup') {
          // Email link verification (magic link, signup confirmation, recovery)
          // The UI will show "Verification Successful!" and a "Continue to Login" button.
          setVerificationStatus('success');
          // Set a more specific message for this flow if needed, or keep generic.
          // setSuccessMessage("Your email has been verified. Please proceed to login.");
        } else if (code) {
          // PKCE flow for email verification
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error('Error exchanging code for session:', exchangeError);
            throw exchangeError;
          }
          // Session should now be established.
          setVerificationStatus('success');
          navigate('/dashboard');
        } else if (searchParams.toString() || window.location.hash) {
          // If there are any other params or hash, but no session and not handled above,
          // it might be an incomplete or erroneous OAuth redirect or other link.
          // Let Supabase attempt to handle it by just checking session again after a brief moment,
          // as sometimes the session is not immediately available.
          // This part is a bit speculative and depends on Supabase client behavior.
          // For now, we can treat it as an unknown state that might resolve to a session.
          // Or, more conservatively, treat as an error if not fitting known patterns.
          console.warn('AuthCallback: Unhandled parameters, attempting to re-check session shortly.');
          // If after a brief delay, no session, then it's an error.
          // This could be simplified by removing this else if and letting it fall to the final else.
          // For now, let's assume if it's not one of the above, it's an error.
          throw new Error('Invalid or incomplete authentication parameters.');
        } else {
          // No session, no recognizable verification params.
          throw new Error('No authentication parameters found. Invalid callback.');
        }
      } catch (error: any) {
        console.error('Auth callback error:', error);
        setVerificationStatus('error');
        setErrorMessage(error.message || 'An error occurred during authentication.');
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

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

  if (verificationStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-green-600">Authentication Successful!</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center space-y-6 py-8">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Process Complete</h3>
              <p className="text-muted-foreground">
                Your authentication process is complete. 
                You will be redirected if successful, or you can proceed to login.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            {/* This button is mainly for email verification flows that don't auto-redirect to dashboard */}
            <Button onClick={handleContinue}>Continue to Login</Button>
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
