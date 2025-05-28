import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PROTECTED_ROUTES = ['/dashboard', '/analytics', '/tasks'];
const AUTH_PAGES = ['/login', '/signup'];

const NavigationHandler: React.FC = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) {
      return; // Wait until authentication status is resolved
    }

    const currentPath = location.pathname;

    if (session) {
      // User is authenticated
      if (AUTH_PAGES.includes(currentPath)) {
        navigate('/dashboard', { replace: true });
      }
    } else {
      // User is not authenticated
      if (PROTECTED_ROUTES.includes(currentPath)) {
        navigate('/login', { replace: true });
      }
    }
  }, [session, loading, location.pathname, navigate]);

  return null; // This component does not render anything
};

export default NavigationHandler;
