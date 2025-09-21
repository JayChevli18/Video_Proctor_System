import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Report } from '@/types';
import { reportAPI } from '@/lib/api';

interface ReportState {
  reports: Report[];
  currentReport: Report | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ReportState = {
  reports: [],
  currentReport: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchReports = createAsyncThunk(
  'reports/fetchReports',
  async (params: any = {}, { rejectWithValue }) => {
    try {
      console.log('fetchReports: Making API call with params:', params);
      const response = await reportAPI.getReports(params);
      console.log('fetchReports: API response:', response);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch reports');
    } catch (error: any) {
      console.error('fetchReports: API error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reports');
    }
  }
);

export const generateReport = createAsyncThunk(
  'reports/generateReport',
  async (interviewId: string, { rejectWithValue }) => {
    try {
      const response = await reportAPI.generateReport(interviewId);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to generate report');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to generate report');
    }
  }
);

export const fetchReportByInterview = createAsyncThunk(
  'reports/fetchReportByInterview',
  async (interviewId: string, { rejectWithValue }) => {
    try {
      const response = await reportAPI.getReportByInterview(interviewId);
      if (response.success && response.data) {
        return response.data;
      }
      return rejectWithValue(response.message || 'Failed to fetch report');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch report');
    }
  }
);

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setCurrentReport: (state, action: PayloadAction<Report | null>) => {
      state.currentReport = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch reports
      .addCase(fetchReports.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Generate report
      .addCase(generateReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reports.unshift(action.payload);
        state.currentReport = action.payload;
      })
      .addCase(generateReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch report by interview
      .addCase(fetchReportByInterview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReportByInterview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentReport = action.payload;
      })
      .addCase(fetchReportByInterview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentReport, clearError } = reportSlice.actions;
export default reportSlice.reducer;
