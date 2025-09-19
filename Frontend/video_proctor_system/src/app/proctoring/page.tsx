'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchInterviews } from '@/store/slices/interviewSlice';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardLayout from '@/components/layout/DashboardLayout';
import VideoProctor from '@/components/proctoring/VideoProctor';
import { Video, Calendar, User, Clock } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useSearchParams } from 'next/navigation';

export default function ProctoringPage() {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const { interviews, isLoading } = useSelector((state: RootState) => state.interviews);
  const [selectedInterview, setSelectedInterview] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchInterviews({ user: user?._id }));
  }, [dispatch]);

  useEffect(() => {
    const interviewId = searchParams.get('interviewId');
    if (interviewId) {
      setSelectedInterview(interviewId);
    }
  }, [searchParams]);

  const availableInterviews = interviews.filter(interview => 
    interview.status === 'scheduled' || interview.status === 'in-progress'
  );

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
    <AuthGuard allowedRoles={['interviewer', 'admin']}>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Live Proctoring</h1>
            <p className="text-gray-600">Monitor interviews in real-time with AI-powered detection</p>
          </div>

          {!selectedInterview ? (
            /* Interview Selection */
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Interview to Monitor</h2>
                
                {availableInterviews.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableInterviews.map((interview) => (
                      <div
                        key={interview._id}
                        onClick={() => setSelectedInterview(interview._id)}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-medium text-gray-900">{interview.title}</h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            interview.status === 'in-progress' 
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {interview.status}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {formatDateTime(interview.scheduledAt)}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            {interview.duration} minutes
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            {typeof interview.candidate === 'object' ? interview.candidate.name : 'Loading...'}
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Integrity Score:</span>
                            <span className={`text-sm font-medium ${
                              interview.integrityScore >= 90 
                                ? 'text-green-600' 
                                : interview.integrityScore >= 70 
                                ? 'text-yellow-600' 
                                : 'text-red-600'
                            }`}>
                              {interview.integrityScore}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No interviews available</h3>
                    <p className="text-gray-600">
                      There are no scheduled or in-progress interviews to monitor.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Video Proctoring Interface */
            <div className="space-y-6">
              {/* Interview Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {interviews.find(i => i._id === selectedInterview)?.title}
                    </h2>
                    <p className="text-gray-600">
                      Monitoring interview in real-time
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedInterview(null)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Back to Selection
                  </button>
                </div>
              </div>

              {/* Video Proctor Component */}
              <VideoProctor interviewId={selectedInterview} />
            </div>
          )}
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
