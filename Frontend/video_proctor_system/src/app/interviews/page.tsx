'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchInterviews, deleteInterview } from '@/store/slices/interviewSlice';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Plus, 
  Calendar, 
  Clock, 
  User, 
  MoreVertical,
  Edit,
  Trash2,
  Play,
  Square
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function InterviewsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { interviews, isLoading } = useSelector((state: RootState) => state.interviews);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    dispatch(fetchInterviews({ user: user?._id }));
  }, [dispatch]);

  const handleDeleteInterview = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this interview?')) {
      try {
        const result = await dispatch(deleteInterview(id));
        if (deleteInterview.fulfilled.match(result)) {
          toast.success('Interview deleted successfully');
        } else {
          toast.error(result.payload as string || 'Failed to delete interview');
        }
      } catch (error) {
        toast.error('An unexpected error occurred');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Interviews</h1>
              <p className="text-gray-600">Manage your interview sessions</p>
            </div>
            {(user?.role === 'interviewer' || user?.role === 'admin') && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Schedule Interview
              </button>
            )}
          </div>

          {/* Interviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviews.length > 0 ? (
              interviews.map((interview) => (
                <div key={interview._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {interview.title}
                        </h3>
                        {interview.description && (
                          <p className="text-sm text-gray-600 mb-3">
                            {interview.description}
                          </p>
                        )}
                      </div>
                      <div className="ml-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
                          {interview.status}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDateTime(interview.scheduledAt)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {interview.duration} minutes
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        {typeof interview.candidate === 'object' ? interview.candidate.name : 'Loading...'}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-gray-500">Integrity Score: </span>
                        <span className={`font-medium ${
                          interview.integrityScore >= 90 
                            ? 'text-green-600' 
                            : interview.integrityScore >= 70 
                            ? 'text-yellow-600' 
                            : 'text-red-600'
                        }`}>
                          {interview.integrityScore}%
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {interview.status === 'scheduled' && (user?.role === 'interviewer' || user?.role === 'admin') && (
                          <button className="p-1 text-green-600 hover:bg-green-50 rounded">
                            <Play className="h-4 w-4" />
                          </button>
                        )}
                        {interview.status === 'in-progress' && (user?.role === 'interviewer' || user?.role === 'admin') && (
                          <button className="p-1 text-red-600 hover:bg-red-50 rounded">
                            <Square className="h-4 w-4" />
                          </button>
                        )}
                        {(user?.role === 'interviewer' || user?.role === 'admin') && (
                          <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                        {(user?.role === 'interviewer' || user?.role === 'admin') && (
                          <button 
                            onClick={() => handleDeleteInterview(interview._id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews found</h3>
                <p className="text-gray-600 mb-4">Get started by scheduling your first interview.</p>
                {(user?.role === 'interviewer' || user?.role === 'admin') && (
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Interview
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
