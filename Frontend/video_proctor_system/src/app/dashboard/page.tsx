'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchInterviews } from '@/store/slices/interviewSlice';
import { fetchReports } from '@/store/slices/reportSlice';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Calendar, 
  Users, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Video
} from 'lucide-react';
import { formatDate, formatDateTime } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { interviews, isLoading: interviewsLoading } = useSelector((state: RootState) => state.interviews);
  const { reports, isLoading: reportsLoading } = useSelector((state: RootState) => state.reports);

  useEffect(() => {
    if (user?._id) {
      console.log('Dashboard: Fetching data for user:', user._id);
      dispatch(fetchInterviews({ user: user._id }));
      dispatch(fetchReports({ user: user._id }));
    } else {
      console.log('Dashboard: No user ID available, skipping API calls');
    }
  }, [dispatch, user?._id]);

  const stats = [
    {
      name: 'Total Interviews',
      value: interviews.length,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Completed Interviews',
      value: interviews.filter(i => i.status === 'completed').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'In Progress',
      value: interviews.filter(i => i.status === 'in-progress').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      name: 'Reports Generated',
      value: reports.length,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const recentInterviews = interviews.slice(0, 5);
  const recentReports = reports.slice(0, 5);

  if (interviewsLoading || reportsLoading) {
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
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your interviews today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Interviews */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Interviews</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {recentInterviews.length > 0 ? (
                  recentInterviews.map((interview) => (
                    <div key={interview._id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{interview.title}</p>
                          <p className="text-sm text-gray-500">
                            {formatDateTime(interview.scheduledAt)}
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          interview.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : interview.status === 'in-progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {interview.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No interviews found
                  </div>
                )}
              </div>
            </div>

            {/* Recent Reports */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Reports</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {recentReports.length > 0 ? (
                  recentReports.map((report) => (
                    <div key={report._id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{report.candidateName}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(report.generatedAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${
                            report.integrityScore >= 90 
                              ? 'text-green-600' 
                              : report.integrityScore >= 70 
                              ? 'text-yellow-600' 
                              : 'text-red-600'
                          }`}>
                            {report.integrityScore}%
                          </p>
                          <p className="text-xs text-gray-500">Integrity Score</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No reports found
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="h-8 w-8 text-blue-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Schedule Interview</p>
                  <p className="text-sm text-gray-500">Create a new interview</p>
                </div>
              </button>
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <Video className="h-8 w-8 text-green-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Start Proctoring</p>
                  <p className="text-sm text-gray-500">Begin live monitoring</p>
                </div>
              </button>
              <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <FileText className="h-8 w-8 text-purple-600 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">View Reports</p>
                  <p className="text-sm text-gray-500">Check interview reports</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
