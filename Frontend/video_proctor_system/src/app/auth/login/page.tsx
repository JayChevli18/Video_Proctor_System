'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import LoginForm from '@/components/auth/LoginForm';
import { Shield } from 'lucide-react';

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <Shield className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Video Proctor System
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Secure online interview monitoring
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </AuthGuard>
  );
}
