// API Constants
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    ME: '/api/auth/me',
    UPDATE_DETAILS: '/api/auth/updatedetails',
    UPDATE_PASSWORD: '/api/auth/updatepassword'
  },
  USERS: {
    BASE: '/api/users',
    BY_ROLE: '/api/users/role'
  },
  INTERVIEWS: {
    BASE: '/api/interviews',
    START: '/api/interviews/:id/start',
    END: '/api/interviews/:id/end',
    DETECTION: '/api/interviews/:id/detection'
  },
  REPORTS: {
    BASE: '/api/reports',
    GENERATE: '/api/reports/generate/:interviewId',
    BY_INTERVIEW: '/api/reports/interview/:interviewId'
  },
  HEALTH: '/api/health'
} as const;

// User Roles
export const USER_ROLES = {
  INTERVIEWER: 'interviewer',
  CANDIDATE: 'candidate',
  ADMIN: 'admin'
} as const;

// Interview Status
export const INTERVIEW_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const;

// Detection Types
export const DETECTION_TYPES = {
  FOCUS_LOST: 'focus_lost',
  FACE_ABSENT: 'face_absent',
  MULTIPLE_FACES: 'multiple_faces',
  PHONE_DETECTED: 'phone_detected',
  NOTES_DETECTED: 'notes_detected',
  DEVICE_DETECTED: 'device_detected'
} as const;

// Severity Levels
export const SEVERITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const;

// Integrity Score Deductions
export const INTEGRITY_DEDUCTIONS = {
  FOCUS_LOSS: 2,
  FACE_ABSENCE: 5,
  MULTIPLE_FACES: 10,
  PHONE_DETECTIONS: 15,
  NOTES_DETECTIONS: 20,
  DEVICE_DETECTIONS: 10
} as const;

// Detection Thresholds
export const DETECTION_THRESHOLDS = {
  FOCUS_LOSS_DURATION: 5, // seconds
  FACE_ABSENCE_DURATION: 10, // seconds
  MIN_CONFIDENCE: 0.7,
  MAX_FACES: 1
} as const;

// File Upload Constants
export const FILE_UPLOAD = {
  MAX_SIZE: '100MB',
  ALLOWED_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
  UPLOAD_PATH: './uploads'
} as const;

// JWT Constants
export const JWT_CONFIG = {
  SECRET_LENGTH: 32,
  DEFAULT_EXPIRE: '7d'
} as const;

// Rate Limiting
export const RATE_LIMITS = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100
} as const;

// Computer Vision Constants
export const CV_CONFIG = {
  FACE_DETECTION: {
    MAX_FACES: 2,
    MIN_DETECTION_CONFIDENCE: 0.5,
    MIN_TRACKING_CONFIDENCE: 0.5
  },
  OBJECT_DETECTION: {
    MODEL_URL: 'https://tfhub.dev/tensorflow/tfjs-model/ssd_mobilenet_v2/1/default/1',
    INPUT_SIZE: [300, 300],
    MIN_CONFIDENCE: 0.7
  }
} as const;

// MediaPipe Constants
export const MEDIAPIPE_CONFIG = {
  FACE_MESH_URL: 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/',
  EYE_LANDMARKS: {
    LEFT_EYE: [33, 42],
    RIGHT_EYE: [362, 374]
  }
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Not authorized to access this route',
  USER_NOT_FOUND: 'User not found',
  INTERVIEW_NOT_FOUND: 'Interview not found',
  REPORT_NOT_FOUND: 'Report not found',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_EXISTS: 'User already exists',
  INVALID_TOKEN: 'Invalid token',
  TOKEN_EXPIRED: 'Token expired',
  SERVER_ERROR: 'Server error',
  CV_SERVICE_NOT_READY: 'Computer vision service not initialized'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  INTERVIEW_CREATED: 'Interview created successfully',
  INTERVIEW_UPDATED: 'Interview updated successfully',
  INTERVIEW_DELETED: 'Interview deleted successfully',
  INTERVIEW_STARTED: 'Interview started successfully',
  INTERVIEW_ENDED: 'Interview ended successfully',
  REPORT_GENERATED: 'Report generated successfully',
  PASSWORD_UPDATED: 'Password updated successfully'
} as const;
