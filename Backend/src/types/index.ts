import { Request } from 'express';

// User Types
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'interviewer' | 'candidate' | 'admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

export interface IUserInput {
  name: string;
  email: string;
  password: string;
  role?: 'interviewer' | 'candidate' | 'admin';
}

// Interview Types
export interface IInterview {
  _id: string;
  title: string;
  description?: string;
  interviewer: string;
  candidate: string;
  scheduledAt: Date;
  duration: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  videoUrl?: string;
  detectionEvents: IDetectionEvent[];
  integrityScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IInterviewInput {
  title: string;
  description?: string;
  candidate: string;
  scheduledAt: Date;
  duration: number;
}

// Detection Event Types
export interface IDetectionEvent {
  type: 'focus_lost' | 'face_absent' | 'multiple_faces' | 'phone_detected' | 'notes_detected' | 'device_detected';
  timestamp: Date;
  duration: number;
  confidence: number;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

// Report Types
export interface IReport {
  _id: string;
  interview: string;
  candidateName: string;
  interviewerName: string;
  interviewDuration: number;
  totalFocusLossEvents: number;
  totalFaceAbsenceEvents: number;
  totalMultipleFacesEvents: number;
  totalPhoneDetections: number;
  totalNotesDetections: number;
  totalDeviceDetections: number;
  integrityScore: number;
  deductions: IDeductions;
  summary: string;
  recommendations: string[];
  generatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDeductions {
  focusLoss: number;
  faceAbsence: number;
  multipleFaces: number;
  phoneDetections: number;
  notesDetections: number;
  deviceDetections: number;
}

// Computer Vision Types
export interface IDetectionResult {
  type: 'focus_lost' | 'face_absent' | 'multiple_faces' | 'phone_detected' | 'notes_detected' | 'device_detected';
  confidence: number;
  timestamp: Date;
  duration: number;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface IObjectDetection {
  class: string;
  confidence: number;
  bbox: number[];
}

// API Response Types
export interface IApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
}

// Authentication Types
export interface IAuthRequest<P = Record<string, string>, ResBody = any, ReqBody = any, ReqQuery = any> extends Request<P, ResBody, ReqBody, ReqQuery> {
  // Populated by auth middleware
  user?: IUser;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: 'interviewer' | 'candidate' | 'admin';
}

// Video Processing Types
export interface IVideoMetadata {
  size: number;
  created: Date;
  modified: Date;
}

// Socket.io Types
export interface ISocketEvents {
  'join-interview': (interviewId: string) => void;
  'interview-started': (data: any) => void;
  'interview-ended': (data: any) => void;
  'detection-event': (data: any) => void;
}

// Environment Types
export interface IEnvironment {
  PORT: string;
  NODE_ENV: string;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRE: string;
  MAX_FILE_SIZE: string;
  UPLOAD_PATH: string;
  CORS_ORIGIN: string;
  LOG_LEVEL: string;
}
