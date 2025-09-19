import { z } from 'zod';
import { USER_ROLES, INTERVIEW_STATUS, DETECTION_TYPES, SEVERITY_LEVELS } from '@/constants';

// User Validation Schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum([USER_ROLES.INTERVIEWER, USER_ROLES.CANDIDATE, USER_ROLES.ADMIN]).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters').optional(),
  email: z.string().email('Please provide a valid email address').optional(),
  role: z.enum([USER_ROLES.INTERVIEWER, USER_ROLES.CANDIDATE, USER_ROLES.ADMIN]).optional(),
  isActive: z.boolean().optional(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

// Interview Validation Schemas
export const createInterviewSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  candidate: z.string().min(1, 'Candidate ID is required'),
  scheduledAt: z.string().datetime('Please provide a valid date and time'),
  duration: z.number().min(1, 'Duration must be at least 1 minute').max(480, 'Duration cannot exceed 8 hours'),
});

export const updateInterviewSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters').optional(),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  candidate: z.string().min(1, 'Candidate ID is required').optional(),
  scheduledAt: z.string().datetime('Please provide a valid date and time').optional(),
  duration: z.number().min(1, 'Duration must be at least 1 minute').max(480, 'Duration cannot exceed 8 hours').optional(),
  status: z.enum([INTERVIEW_STATUS.SCHEDULED, INTERVIEW_STATUS.IN_PROGRESS, INTERVIEW_STATUS.COMPLETED, INTERVIEW_STATUS.CANCELLED]).optional(),
});

// Detection Event Validation Schema
export const detectionEventSchema = z.object({
  type: z.enum([
    DETECTION_TYPES.FOCUS_LOST,
    DETECTION_TYPES.FACE_ABSENT,
    DETECTION_TYPES.MULTIPLE_FACES,
    DETECTION_TYPES.PHONE_DETECTED,
    DETECTION_TYPES.NOTES_DETECTED,
    DETECTION_TYPES.DEVICE_DETECTED,
  ]),
  timestamp: z.string().datetime('Please provide a valid timestamp'),
  duration: z.number().min(0, 'Duration must be non-negative'),
  confidence: z.number().min(0, 'Confidence must be between 0 and 1').max(1, 'Confidence must be between 0 and 1'),
  description: z.string().min(1, 'Description is required'),
  severity: z.enum([SEVERITY_LEVELS.LOW, SEVERITY_LEVELS.MEDIUM, SEVERITY_LEVELS.HIGH]).optional(),
});

// Frame Processing Validation Schema
export const frameProcessingSchema = z.object({
  frameBase64: z.string().min(1, 'Frame data is required'),
  duration: z.number().min(0, 'Duration must be non-negative').optional(),
});

// Query Parameters Validation Schemas
export const paginationSchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
});

export const interviewQuerySchema = z.object({
  status: z.enum([INTERVIEW_STATUS.SCHEDULED, INTERVIEW_STATUS.IN_PROGRESS, INTERVIEW_STATUS.COMPLETED, INTERVIEW_STATUS.CANCELLED]).optional(),
  candidate: z.string().optional(),
  interviewer: z.string().optional(),
  ...paginationSchema.shape,
});

export const reportQuerySchema = z.object({
  candidate: z.string().optional(),
  interviewer: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  ...paginationSchema.shape,
});

// File Upload Validation Schema
export const fileUploadSchema = z.object({
  fieldname: z.string(),
  originalname: z.string(),
  encoding: z.string(),
  mimetype: z.string().regex(/^video\//, 'Only video files are allowed'),
  size: z.number().max(100 * 1024 * 1024, 'File size cannot exceed 100MB'),
});

// Type exports for use in controllers
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;
export type UpdateInterviewInput = z.infer<typeof updateInterviewSchema>;
export type DetectionEventInput = z.infer<typeof detectionEventSchema>;
export type FrameProcessingInput = z.infer<typeof frameProcessingSchema>;
export type PaginationQuery = z.infer<typeof paginationSchema>;
export type InterviewQuery = z.infer<typeof interviewQuerySchema>;
export type ReportQuery = z.infer<typeof reportQuerySchema>;
export type FileUploadInput = z.infer<typeof fileUploadSchema>;
