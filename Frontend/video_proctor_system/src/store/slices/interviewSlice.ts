import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Interview, CreateInterviewData, DetectionEvent } from '@/types';
import { interviewAPI } from '@/lib/api';

interface InterviewState {
  interviews: Interview[];
  currentInterview: Interview | null;
  isLoading: boolean;
  error: string | null;
  detectionEvents: DetectionEvent[];
  realTimeIntegrityScore: number;
}

const initialState: InterviewState = {
  interviews: [],
  currentInterview: null,
  isLoading: false,
  error: null,
  detectionEvents: [],
  realTimeIntegrityScore: 100,
};

// Async thunks
export const fetchInterviews = createAsyncThunk(
  'interviews/fetchInterviews',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await interviewAPI.getInterviews(params);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch interviews');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch interviews');
    }
  }
);

export const fetchInterview = createAsyncThunk(
  'interviews/fetchInterview',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await interviewAPI.getInterview(id);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch interview');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch interview');
    }
  }
);

export const createInterview = createAsyncThunk(
  'interviews/createInterview',
  async (interviewData: CreateInterviewData, { rejectWithValue }) => {
    try {
      const response = await interviewAPI.createInterview(interviewData);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to create interview');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create interview');
    }
  }
);

export const updateInterview = createAsyncThunk(
  'interviews/updateInterview',
  async ({ id, data }: { id: string; data: Partial<CreateInterviewData> }, { rejectWithValue }) => {
    try {
      const response = await interviewAPI.updateInterview(id, data);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to update interview');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update interview');
    }
  }
);

export const deleteInterview = createAsyncThunk(
  'interviews/deleteInterview',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await interviewAPI.deleteInterview(id);
      if (response.success) {
        return id;
      }
      return rejectWithValue(response.message || 'Failed to delete interview');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete interview');
    }
  }
);

export const startInterview = createAsyncThunk(
  'interviews/startInterview',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await interviewAPI.startInterview(id);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to start interview');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to start interview');
    }
  }
);

export const endInterview = createAsyncThunk(
  'interviews/endInterview',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await interviewAPI.endInterview(id);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to end interview');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to end interview');
    }
  }
);

export const uploadVideo = createAsyncThunk(
  'interviews/uploadVideo',
  async ({ id, file }: { id: string; file: File }, { rejectWithValue }) => {
    try {
      const response = await interviewAPI.uploadVideo(id, file);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to upload video');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload video');
    }
  }
);

export const processFrame = createAsyncThunk(
  'interviews/processFrame',
  async ({ id, frameData }: { id: string; frameData: { frameBase64: string; duration?: number } }, { rejectWithValue }) => {
    try {
      const response = await interviewAPI.processFrame(id, frameData);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to process frame');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to process frame');
    }
  }
);

const interviewSlice = createSlice({
  name: 'interviews',
  initialState,
  reducers: {
    setCurrentInterview: (state, action: PayloadAction<Interview | null>) => {
      state.currentInterview = action.payload;
    },
    addDetectionEvent: (state, action: PayloadAction<DetectionEvent>) => {
      state.detectionEvents.push(action.payload);
    },
    setDetectionEvents: (state, action: PayloadAction<DetectionEvent[]>) => {
      state.detectionEvents = action.payload;
    },
    updateIntegrityScore: (state, action: PayloadAction<number>) => {
      state.realTimeIntegrityScore = action.payload;
    },
    clearDetectionEvents: (state) => {
      state.detectionEvents = [];
      state.realTimeIntegrityScore = 100;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch interviews
      .addCase(fetchInterviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInterviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.interviews = action.payload;
      })
      .addCase(fetchInterviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch single interview
      .addCase(fetchInterview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInterview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentInterview = action.payload;
        state.detectionEvents = action.payload.detectionEvents || [];
        state.realTimeIntegrityScore = action.payload.integrityScore;
      })
      .addCase(fetchInterview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create interview
      .addCase(createInterview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createInterview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.interviews.unshift(action.payload);
      })
      .addCase(createInterview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update interview
      .addCase(updateInterview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateInterview.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.interviews.findIndex(interview => interview._id === action.payload._id);
        if (index !== -1) {
          state.interviews[index] = action.payload;
        }
        if (state.currentInterview?._id === action.payload._id) {
          state.currentInterview = action.payload;
        }
      })
      .addCase(updateInterview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete interview
      .addCase(deleteInterview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteInterview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.interviews = state.interviews.filter(interview => interview._id !== action.payload);
        if (state.currentInterview?._id === action.payload) {
          state.currentInterview = null;
        }
      })
      .addCase(deleteInterview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Start interview
      .addCase(startInterview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startInterview.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.interviews.findIndex(interview => interview._id === action.payload._id);
        if (index !== -1) {
          state.interviews[index] = action.payload;
        }
        if (state.currentInterview?._id === action.payload._id) {
          state.currentInterview = action.payload;
        }
      })
      .addCase(startInterview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // End interview
      .addCase(endInterview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(endInterview.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.interviews.findIndex(interview => interview._id === action.payload._id);
        if (index !== -1) {
          state.interviews[index] = action.payload;
        }
        if (state.currentInterview?._id === action.payload._id) {
          state.currentInterview = action.payload;
        }
      })
      .addCase(endInterview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Upload video
      .addCase(uploadVideo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.detectionEvents.push(...action.payload);
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Process frame
      .addCase(processFrame.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(processFrame.fulfilled, (state, action) => {
        state.isLoading = false;
        state.detectionEvents.push(...action.payload);
      })
      .addCase(processFrame.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentInterview,
  addDetectionEvent,
  setDetectionEvents,
  updateIntegrityScore,
  clearDetectionEvents,
  clearError,
} = interviewSlice.actions;

export default interviewSlice.reducer;
