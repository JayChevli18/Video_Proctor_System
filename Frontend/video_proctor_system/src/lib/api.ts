import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, LoginCredentials, RegisterData, User, Interview, CreateInterviewData, Report, DetectionEvent } from '@/types';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log API configuration
console.log('API Configuration:', {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  env: process.env.NODE_ENV
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      hasToken: !!token,
      baseURL: config.baseURL
    });
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateDetails: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put('/auth/updatedetails', userData);
    return response.data;
  },

  updatePassword: async (passwordData: { currentPassword: string; newPassword: string }): Promise<ApiResponse> => {
    const response = await api.put('/auth/updatepassword', passwordData);
    return response.data;
  },
};

// User API
export const userAPI = {
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await api.get('/users');
    return response.data;
  },

  getUser: async (id: string): Promise<ApiResponse<User>> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData: RegisterData): Promise<ApiResponse<User>> => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  getUsersByRole: async (role: string): Promise<ApiResponse<User[]>> => {
    const response = await api.get(`/users/role/${role}`);
    return response.data;
  },
};

// Interview API
export const interviewAPI = {
  getInterviews: async (params?: any): Promise<ApiResponse<Interview[]>> => {
    const response = await api.get('/interviews', { params });
    return response.data;
  },

  getInterview: async (id: string): Promise<ApiResponse<Interview>> => {
    const response = await api.get(`/interviews/${id}`);
    return response.data;
  },

  createInterview: async (interviewData: CreateInterviewData): Promise<ApiResponse<Interview>> => {
    const response = await api.post('/interviews', interviewData);
    return response.data;
  },

  updateInterview: async (id: string, interviewData: Partial<CreateInterviewData>): Promise<ApiResponse<Interview>> => {
    const response = await api.put(`/interviews/${id}`, interviewData);
    return response.data;
  },

  deleteInterview: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/interviews/${id}`);
    return response.data;
  },

  startInterview: async (id: string): Promise<ApiResponse<Interview>> => {
    const response = await api.put(`/interviews/${id}/start`);
    return response.data;
  },

  endInterview: async (id: string): Promise<ApiResponse<Interview>> => {
    const response = await api.put(`/interviews/${id}/end`);
    return response.data;
  },

  addDetectionEvent: async (id: string, event: DetectionEvent): Promise<ApiResponse<DetectionEvent>> => {
    const response = await api.post(`/interviews/${id}/detection`, event);
    return response.data;
  },

  uploadVideo: async (id: string, file: File): Promise<ApiResponse<DetectionEvent[]>> => {
    const formData = new FormData();
    formData.append('video', file);
    const response = await api.post(`/interviews/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  processFrame: async (id: string, frameData: { frameBase64: string; duration?: number }): Promise<ApiResponse<DetectionEvent[]>> => {
    const response = await api.post(`/interviews/${id}/frame`, frameData);
    return response.data;
  },
};

// Report API
export const reportAPI = {
  getReports: async (params?: any): Promise<ApiResponse<Report[]>> => {
    const response = await api.get('/reports', { params });
    return response.data;
  },

  generateReport: async (interviewId: string): Promise<ApiResponse<Report>> => {
    const response = await api.post(`/reports/generate/${interviewId}`);
    return response.data;
  },

  getReportByInterview: async (interviewId: string): Promise<ApiResponse<Report>> => {
    const response = await api.get(`/reports/interview/${interviewId}`);
    return response.data;
  },
};

// Health Check API
export const healthAPI = {
  check: async (): Promise<ApiResponse<{ status: string; timestamp: string; uptime: number }>> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
