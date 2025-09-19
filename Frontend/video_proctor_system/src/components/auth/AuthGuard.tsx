'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { getCurrentUser } from '@/store/slices/authSlice';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: string[];
}

export default function AuthGuard({ 
  children, 
  requireAuth = true, 
  allowedRoles = [] 
}: AuthGuardProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (requireAuth) {
      if (!token) {
        router.push('/auth/login');
        return;
      }
      
      if (!isAuthenticated && !isLoading) {
        dispatch(getCurrentUser());
      }
    }
  }, [requireAuth, isAuthenticated, isLoading, router, dispatch]);

  useEffect(() => {
    if (requireAuth && isAuthenticated && user) {
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [requireAuth, isAuthenticated, user, allowedRoles, router]);

  if (requireAuth && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (requireAuth && user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
