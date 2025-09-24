'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { UsersTable } from '@/components/users/UsersTable';
import { UserModal } from '@/components/users/UserModal';
import { UsersFilters } from '@/components/users/UsersFilters';
import { UsersStats } from '@/components/users/UsersStats';
import { Plus, Users as UsersIcon, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useUsers } from '@/hooks/useUsers';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function UsersPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    role: '',
    isActive: '',
    search: ''
  });

  // Debug logging
  console.log('Users page - Current filters:', filters);
  console.log('Users page - User role:', user?.role);
//   const users= {
//     data: [],
//     isLoading: false,
//     error: null,
//     refetch: () => {}   
//   }
  const {
    data: users,
    isLoading,
    error,
    refetch
  } = useUsers(filters);

  // RBAC Check - Only admins can access this page
  if (user?.role !== 'admin') {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <UsersIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
              <p className="text-gray-600">You don't have permission to view this page.</p>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <UsersIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Users</h1>
              <p className="text-gray-600 mb-4">{error.message}</p>
              <Button onClick={() => refetch()} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
              <p className="mt-2 text-gray-600">
                Manage system users, roles, and permissions
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </div>

          {/* Stats Cards */}
          <UsersStats users={users?.data || []} />

          {/* Filters */}
          <UsersFilters
            filters={filters}
            onFiltersChange={setFilters}
          />

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow">
            <UsersTable
              users={users?.data || []}
              onUserUpdate={refetch}
              onUserDelete={refetch}
            />
          </div>

          {/* User Modal */}
          {showCreateModal && (
            <UserModal
              isOpen={showCreateModal}
              onClose={() => setShowCreateModal(false)}
              onUserSaved={() => {
                setShowCreateModal(false);
                refetch();
              }}
            />
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
