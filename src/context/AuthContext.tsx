import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User, AuthResponse } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signUp: (email: string, password: string) => Promise<{
    error: Error | null;
    data: any;
    isConfirmed?: boolean;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: Session | null;
  }>;
  signOut: () => Promise<void>;
  loading: boolean;
  resendVerificationEmail: (email: string) => Promise<{
    error: Error | null;
    data: any;
  }>;
  verifyOtp: (email: string, token: string, type: 'email') => Promise<{
    error: Error | null;
    data: any;
  }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    
    // Check if the user needs to confirm their email
    const isConfirmed = response.data?.user?.identities?.length === 0;
    
    return { 
      data: response.data, 
      error: response.error,
      isConfirmed: isConfirmed
    };
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error }: AuthResponse = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    return { data: data.session, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      // First, try using the newer .resend method
      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      // If there's an error, it might be that the user is already confirmed
      // or another error, so let's try signing up again which will resend the email
      if (error) {
        // Try to sign up again - this will resend the confirmation email if the user exists but isn't confirmed
        const signUpResponse = await supabase.auth.signUp({
          email,
          password: '', // We don't have the password here, but Supabase will just check if the user exists
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        
        // If signing up again also returns an error, return that error
        if (signUpResponse.error) {
          return { data: null, error: signUpResponse.error };
        }
        
        // If we get here, the sign-up worked (which means the email was sent again)
        return { data: signUpResponse.data, error: null };
      }
      
      // If there was no error with the initial resend, return the data and error
      return { data, error };
    } catch (err: any) {
      // Handle any unexpected errors
      return { data: null, error: new Error(err.message || 'Failed to resend verification email') };
    }
  };

  const verifyOtp = async (email: string, token: string, type: 'email') => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type
    });
    return { data, error };
  };

  const value = {
    session,
    user,
    signUp,
    signIn,
    signOut,
    loading,
    resendVerificationEmail,
    verifyOtp,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
