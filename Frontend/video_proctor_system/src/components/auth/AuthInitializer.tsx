'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { getCurrentUser } from '@/store/slices/authSlice';

export default function AuthInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    console.log('AuthInitializer: Current state:', { 
      hasToken: !!token, 
      hasUser: !!user, 
      isLoading, 
      isAuthenticated 
    });
    
    // If we have a token but no user data, fetch the current user
    if (token && !user && !isLoading) {
      console.log('AuthInitializer: Token found but no user, fetching current user...');
      dispatch(getCurrentUser());
    }
  }, [dispatch, user, isLoading, isAuthenticated]);

  // This component doesn't render anything, it just initializes auth state
  return null;
}
