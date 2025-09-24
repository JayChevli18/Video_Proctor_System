'use client';

import { useState, useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { debounce } from '@/lib/utils';

export interface UsersFiltersProps {
  filters: {
    role: string;
    isActive: string;
    search: string;
  };
  onFiltersChange: (filters: { role: string; isActive: string; search: string }) => void;
}

export const UsersFilters = ({ filters, onFiltersChange }: UsersFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState(filters.search);

  
  const debouncedFetchData = useCallback(
    debounce((value: string) => {
      onFiltersChange({
        ...filters,
        search: value,
      });
    }, 1000),
    []
  );
  // Debounce search input
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     onFiltersChange({
  //       ...filters,
  //       search: searchValue,
  //     });
  //   }, 300);

  //   return () => clearTimeout(timer);
  // }, [searchValue, filters, onFiltersChange]);

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
    debouncedFetchData(value);
  };

  const clearFilters = () => {
    setSearchValue('');
    onFiltersChange({
      role: '',
      isActive: '',
      search: '',
    });
    debouncedFetchData('');
  };

  const hasActiveFilters = filters.role || filters.isActive || filters.search;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-1" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </div>
      </div>

      {/* Search Bar - Always Visible */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              debouncedFetchData(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={filters.role}
              onChange={(e) => {
                handleFilterChange('role', e.target.value);
                debouncedFetchData(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="interviewer">Interviewer</option>
              <option value="candidate">Candidate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.isActive}
              onChange={(e) => {
                handleFilterChange('isActive', e.target.value);
                debouncedFetchData(e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
