'use client';

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { createInterview } from '@/store/slices/interviewSlice';
import { userAPI } from '@/lib/api';
import { User, CreateInterviewData } from '@/types';
import { X, Calendar, Clock, User as UserIcon, FileText, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface InterviewCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(1, 'Title is required')
    .max(100, 'Title cannot exceed 100 characters')
    .required('Title is required'),
  description: Yup.string()
    .max(500, 'Description cannot exceed 500 characters'),
  candidate: Yup.string()
    .required('Please select a candidate'),
  scheduledAt: Yup.string()
    .required('Please select date and time'),
  duration: Yup.number()
    .min(1, 'Duration must be at least 1 minute')
    .max(480, 'Duration cannot exceed 8 hours')
    .required('Duration is required'),
});

export default function InterviewCreationModal({ isOpen, onClose }: InterviewCreationModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading } = useSelector((state: RootState) => state.interviews);
  const [candidates, setCandidates] = useState<User[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      candidate: '',
      scheduledAt: '',
      duration: 60,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const interviewData: CreateInterviewData = {
          title: values.title,
          description: values.description || undefined,
          candidate: values.candidate,
          scheduledAt: new Date(values.scheduledAt).toISOString(),
          duration: values.duration,
        };

        const result = await dispatch(createInterview(interviewData));
        if (createInterview.fulfilled.match(result)) {
          toast.success('Interview scheduled successfully!');
          formik.resetForm();
          onClose();
        } else {
          toast.error(result.payload as string || 'Failed to create interview');
        }
      } catch (error) {
        toast.error('An unexpected error occurred');
      }
    },
  });

  // Fetch candidates when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchCandidates();
    }
  }, [isOpen]);

  const fetchCandidates = async () => {
    try {
      setLoadingCandidates(true);
      const response = await userAPI.getUsersByRole('candidate');
      if (response.success && response.data) {
        setCandidates(response.data);
      } else {
        toast.error('Failed to fetch candidates');
      }
    } catch (error) {
      toast.error('Failed to fetch candidates');
    } finally {
      setLoadingCandidates(false);
    }
  };

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Schedule New Interview</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-2" />
              Interview Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="e.g., Frontend Developer Interview"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formik.touched.title && formik.errors.title
                  ? 'border-red-300'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.title && formik.errors.title && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {formik.errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Optional description of the interview..."
              rows={3}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formik.touched.description && formik.errors.description
                  ? 'border-red-300'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {formik.errors.description}
              </p>
            )}
          </div>

          {/* Candidate Selection */}
          <div>
            <label htmlFor="candidate" className="block text-sm font-medium text-gray-700 mb-2">
              <UserIcon className="h-4 w-4 inline mr-2" />
              Select Candidate *
            </label>
            {loadingCandidates ? (
              <div className="flex items-center justify-center py-4">
                <LoadingSpinner size="sm" />
                <span className="ml-2 text-sm text-gray-600">Loading candidates...</span>
              </div>
            ) : (
              <select
                id="candidate"
                name="candidate"
                value={formik.values.candidate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formik.touched.candidate && formik.errors.candidate
                    ? 'border-red-300'
                    : 'border-gray-300'
                }`}
              >
                <option value="">Select a candidate...</option>
                {candidates.map((candidate) => (
                  <option key={candidate._id} value={candidate._id}>
                    {candidate.name} ({candidate.email})
                  </option>
                ))}
              </select>
            )}
            {formik.touched.candidate && formik.errors.candidate && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {formik.errors.candidate}
              </p>
            )}
          </div>

          {/* Date and Time */}
          <div>
            <label htmlFor="scheduledAt" className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-2" />
              Date & Time *
            </label>
            <input
              type="datetime-local"
              id="scheduledAt"
              name="scheduledAt"
              value={formik.values.scheduledAt}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              min={new Date().toISOString().slice(0, 16)}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formik.touched.scheduledAt && formik.errors.scheduledAt
                  ? 'border-red-300'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.scheduledAt && formik.errors.scheduledAt && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {formik.errors.scheduledAt}
              </p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="h-4 w-4 inline mr-2" />
              Duration (minutes) *
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formik.values.duration}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              min="1"
              max="480"
              placeholder="60"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                formik.touched.duration && formik.errors.duration
                  ? 'border-red-300'
                  : 'border-gray-300'
              }`}
            />
            {formik.touched.duration && formik.errors.duration && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {formik.errors.duration}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Duration should be between 1 and 480 minutes (8 hours)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !formik.isValid}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Scheduling...</span>
                </>
              ) : (
                'Schedule Interview'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
