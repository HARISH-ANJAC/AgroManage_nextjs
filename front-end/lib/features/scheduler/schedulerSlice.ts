import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface SchedulerSetting {
  SNO: number;
  JOB_NAME: string;
  CRON_EXPRESSION: string;
  IS_ENABLED: string;
  LAST_RUN: string | null;
  REMARKS: string;
  MODIFIED_BY: string;
  MODIFIED_DATE: string;
}

interface SchedulerState {
  settings: SchedulerSetting[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SchedulerState = {
  settings: [],
  isLoading: false,
  error: null,
};

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''}` }
});

export const fetchSchedulerSettings = createAsyncThunk(
  'scheduler/fetchSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/scheduler`, getAuthHeaders());
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.msg || "Failed to fetch scheduler settings");
    }
  }
);

export const updateSchedulerSetting = createAsyncThunk(
  'scheduler/updateSetting',
  async ({ sno, payload }: { sno: number; payload: any }, { rejectWithValue, dispatch }) => {
    try {
      await axios.put(`${API_BASE_URL}/scheduler/${sno}`, payload, getAuthHeaders());
      dispatch(fetchSchedulerSettings());
      return { sno, payload };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.msg || "Failed to update scheduler setting");
    }
  }
);

const schedulerSlice = createSlice({
  name: 'scheduler',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchedulerSettings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSchedulerSettings.fulfilled, (state, action: PayloadAction<SchedulerSetting[]>) => {
        state.isLoading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSchedulerSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSchedulerSetting.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSchedulerSetting.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateSchedulerSetting.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default schedulerSlice.reducer;
