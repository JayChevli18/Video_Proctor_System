'use client';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchReports, generateReport } from '@/store/slices/reportSlice';
import { fetchInterviews } from '@/store/slices/interviewSlice';
import AuthGuard from '@/components/auth/AuthGuard';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  FileText, 
  Download, 
  Eye, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar
} from 'lucide-react';
import { formatDate, formatDateTime } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { reports, isLoading: reportsLoading } = useSelector((state: RootState) => state.reports);
  const { interviews, isLoading: interviewsLoading } = useSelector((state: RootState) => state.interviews);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchReports({ user: user?._id }));
    dispatch(fetchInterviews({ user: user?._id }));
  }, [dispatch]);

  const handleGenerateReport = async (interviewId: string) => {
    try {
      const result = await dispatch(generateReport(interviewId));
      if (generateReport.fulfilled.match(result)) {
        toast.success('Report generated successfully');
      } else {
        toast.error(result.payload as string || 'Failed to generate report');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  const getIntegrityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getIntegrityScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 70) return <Clock className="h-5 w-5 text-yellow-600" />;
    return <AlertTriangle className="h-5 w-5 text-red-600" />;
  };

  const completedInterviews = interviews.filter(i => i.status === 'completed');
  const interviewsWithoutReports = completedInterviews.filter(interview => 
    !reports.some(report => 
      typeof report.interview === 'string' 
        ? report.interview === interview._id 
        : report.interview._id === interview._id
    )
  );

  if (reportsLoading || interviewsLoading) {
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
              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
              <p className="text-gray-600">View and analyze interview integrity reports</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">High Integrity</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reports.filter(r => r.integrityScore >= 90).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Medium Integrity</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reports.filter(r => r.integrityScore >= 70 && r.integrityScore < 90).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Low Integrity</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reports.filter(r => r.integrityScore < 70).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Generate Reports Section */}
          {interviewsWithoutReports.length > 0 && (user?.role === 'interviewer' || user?.role === 'admin') && (
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Generate Reports for Completed Interviews
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {interviewsWithoutReports.map((interview) => (
                    <div key={interview._id} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">{interview.title}</h3>
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          {typeof interview.candidate === 'object' ? interview.candidate.name : 'Loading...'}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(interview.scheduledAt)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleGenerateReport(interview._id)}
                        className="w-full inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reports List */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">All Reports</h2>
            </div>
            
            {reports.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {reports.map((report) => (
                  <div key={report._id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-lg font-medium text-gray-900 mr-3">
                            {report.candidateName}
                          </h3>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getIntegrityScoreColor(report.integrityScore)}`}>
                            {getIntegrityScoreIcon(report.integrityScore)}
                            <span className="ml-1">{report.integrityScore}%</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Interviewer:</span> {report.interviewerName}
                          </div>
                          <div>
                            <span className="font-medium">Duration:</span> {report.interviewDuration} min
                          </div>
                          <div>
                            <span className="font-medium">Generated:</span> {formatDate(report.generatedAt)}
                          </div>
                          <div>
                            <span className="font-medium">Detections:</span> {report.totalFocusLossEvents + report.totalFaceAbsenceEvents + report.totalMultipleFacesEvents + report.totalPhoneDetections + report.totalNotesDetections + report.totalDeviceDetections}
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">{report.summary}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {report.recommendations.slice(0, 3).map((recommendation, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {recommendation}
                            </span>
                          ))}
                          {report.recommendations.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{report.recommendations.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => setSelectedReport(report._id)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </button>
                        <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                <p className="text-gray-600">
                  Reports will appear here once interviews are completed and reports are generated.
                </p>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
