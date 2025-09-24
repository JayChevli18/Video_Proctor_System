import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '@/lib/api';
import { User, RegisterData } from '@/types';
import toast from 'react-hot-toast';

// Query Keys
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: Record<string, string>) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  byRole: (role: string) => [...userKeys.all, 'role', role] as const,
};

// Hook to get all users with filters
export const useUsers = (filters: Record<string, string> = {}) => {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: async () => {
      console.log('Fetching users with filters:', filters);
      const response = await userAPI.getUsers();
      console.log('Users API response:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch users');
      }
      
      // Apply client-side filtering
      let filteredUsers = response.data || [];
      
      if (filters.role && filters.role !== '') {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }
      
      if (filters.isActive !== '') {
        const isActive = filters.isActive === 'true';
        filteredUsers = filteredUsers.filter(user => user.isActive === isActive);
      }
      
      if (filters.search && filters.search.trim() !== '') {
        const searchTerm = filters.search.toLowerCase().trim();
        filteredUsers = filteredUsers.filter(user => 
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
        );
      }
      
      console.log('Filtered users:', filteredUsers);
      
      return {
        ...response,
        data: filteredUsers
      };
    },
    staleTime: 1 * 60 * 1000, // 1 minute (reduced for better real-time updates)
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Hook to get a single user
export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const response = await userAPI.getUser(id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch user');
      }
      return response;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to get users by role
export const useUsersByRole = (role: string) => {
  return useQuery({
    queryKey: userKeys.byRole(role),
    queryFn: async () => {
      const response = await userAPI.getUsersByRole(role);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch users by role');
      }
      return response;
    },
    enabled: !!role,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to create a user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: RegisterData) => {
      console.log('Creating user:', userData);
      const response = await userAPI.createUser(userData);
      console.log('Create user response:', response);
      if (!response.success) {
        throw new Error(response.message || 'Failed to create user');
      }
      return response;
    },
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User created successfully');
    },
    onError: (error: Error) => {
      console.error('Create user error:', error);
      toast.error(error.message || 'Failed to create user');
    },
  });
};

// Hook to update a user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, userData }: { id: string; userData: Partial<User> }) => {
      console.log('Updating user:', id, userData);
      const response = await userAPI.updateUser(id, userData);
      console.log('Update user response:', response);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update user');
      }
      return response;
    },
    onSuccess: (data, variables) => {
      // Update the specific user in cache
      queryClient.setQueryData(userKeys.detail(variables.id), data);
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User updated successfully');
    },
    onError: (error: Error) => {
      console.error('Update user error:', error);
      toast.error(error.message || 'Failed to update user');
    },
  });
};

// Hook to delete a user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await userAPI.deleteUser(id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete user');
      }
      return response;
    },
    onSuccess: (_, id) => {
      // Remove the user from cache
      queryClient.removeQueries({ queryKey: userKeys.detail(id) });
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success('User deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete user');
    },
  });
};

// Hook to toggle user active status
export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await userAPI.updateUser(id, { isActive });
      if (!response.success) {
        throw new Error(response.message || 'Failed to update user status');
      }
      return response;
    },
    onSuccess: (data, variables) => {
      // Update the specific user in cache
      queryClient.setQueryData(userKeys.detail(variables.id), data);
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success(`User ${variables.isActive ? 'activated' : 'deactivated'} successfully`);
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update user status');
    },
  });
};
