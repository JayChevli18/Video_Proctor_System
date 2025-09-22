// User Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'interviewer' | 'candidate' | 'admin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'interviewer' | 'candidate' | 'admin';
}

// Interview Types
export interface Interview {
  _id: string;
  title: string;
  description?: string;
  interviewer: User | string;
  candidate: User | string;
  scheduledAt: string;
  duration: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  videoUrl?: string;
  detectionEvents: DetectionEvent[];
  integrityScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInterviewData {
  title: string;
  description?: string;
  candidate: string;
  scheduledAt: string;
  duration: number;
}

// Detection Event Types
export interface DetectionEvent {
  type: 'focus_lost' | 'face_absent' | 'multiple_faces' | 'phone_detected' | 'notes_detected' | 'device_detected';
  timestamp: string;
  duration: number;
  confidence: number;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

// Report Types
export interface Report {
  _id: string;
  interview: string | Interview;
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
  deductions: {
    focusLoss: number;
    faceAbsence: number;
    multipleFaces: number;
    phoneDetections: number;
    notesDetections: number;
    deviceDetections: number;
  };
  summary: string;
  recommendations: string[];
  generatedAt: string;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
}

// Auth State Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Socket Event Types
export interface InterviewStartedData {
  interviewId: string;
  status: string;
  startedAt: Date;
}

export interface InterviewEndedData {
  interviewId: string;
  status: string;
  endedAt: Date;
}

export interface DetectionEventData {
  interviewId: string;
  event: DetectionEvent;
  integrityScore: number;
}

export interface SocketEvents {
  'join-interview': (interviewId: string) => void;
  'interview-started': (data: InterviewStartedData) => void;
  'interview-ended': (data: InterviewEndedData) => void;
  'detection-event': (data: DetectionEventData) => void;
}

// Video Processing Types
export interface VideoFrame {
  data: string; // base64
  timestamp: number;
}

export interface DetectionResult {
  type: DetectionEvent['type'];
  confidence: number;
  timestamp: string;
  duration: number;
  description: string;
  severity: DetectionEvent['severity'];
}

// UI State Types
export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Notification[];
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'date' | 'number';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
  validation?: Record<string, unknown>;
}

// Chart Data Types
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  label?: string;
}
