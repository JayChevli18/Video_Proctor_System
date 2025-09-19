// Application Constants
export const APP_CONFIG = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  UPLOAD_PATH: './uploads',
  LOGS_PATH: './logs',
  SUPPORTED_VIDEO_FORMATS: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'],
  SUPPORTED_IMAGE_FORMATS: ['jpg', 'jpeg', 'png', 'gif', 'bmp'],
} as const;

// Detection Constants
export const DETECTION_CONFIG = {
  FOCUS_LOST_THRESHOLD: 5, // seconds
  FACE_ABSENT_THRESHOLD: 10, // seconds
  CONFIDENCE_THRESHOLD: 0.7,
  FRAME_PROCESSING_INTERVAL: 1000, // milliseconds
} as const;

// Integrity Score Deductions
export const INTEGRITY_DEDUCTIONS = {
  FOCUS_LOST: 2,
  FACE_ABSENT: 5,
  MULTIPLE_FACES: 10,
  PHONE_DETECTED: 15,
  NOTES_DETECTED: 20,
  DEVICE_DETECTED: 10,
} as const;

// User Roles
export const USER_ROLES = {
  INTERVIEWER: 'interviewer',
  CANDIDATE: 'candidate',
  ADMIN: 'admin',
} as const;

// Interview Status
export const INTERVIEW_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Detection Event Types
export const DETECTION_TYPES = {
  FOCUS_LOST: 'focus_lost',
  FACE_ABSENT: 'face_absent',
  MULTIPLE_FACES: 'multiple_faces',
  PHONE_DETECTED: 'phone_detected',
  NOTES_DETECTED: 'notes_detected',
  DEVICE_DETECTED: 'device_detected',
} as const;

// Severity Levels
export const SEVERITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

// API Response Messages
export const API_MESSAGES = {
  SUCCESS: 'Operation completed successfully',
  ERROR: 'An error occurred',
  UNAUTHORIZED: 'Not authorized to access this resource',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
} as const;

// Computer Vision Model URLs
export const MODEL_URLS = {
  FACE_MESH: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/',
  OBJECT_DETECTION: 'https://tfhub.dev/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1',
} as const;

// Rate Limiting
export const RATE_LIMITS = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100, // requests per window
} as const;