import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { inquiryService } from '../../api/services/inquiryService';

// 모든 문의 조회 (관리자용)
export const fetchInquiries = createAsyncThunk(
  'inquiries/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await inquiryService.getInquiries();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch inquiries'
      );
    }
  }
);

// ID로 문의 조회 (관리자용)
export const fetchInquiryById = createAsyncThunk(
  'inquiries/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await inquiryService.getInquiryById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || `Failed to fetch inquiry ${id}`
      );
    }
  }
);

// 문의 상태 업데이트 (관리자용)
export const updateInquiryStatus = createAsyncThunk(
  'inquiries/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await inquiryService.updateInquiryStatus(id, status);
      return response.data; // Updated inquiry object
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || `Failed to update inquiry status for ${id}`
      );
    }
  }
);

const initialState = {
  inquiries: [],
  currentInquiry: null, // For single inquiry view
  loading: 'idle', // 'idle' | 'pending' | 'succeeded' | 'failed'
  error: null,
};

const inquirySlice = createSlice({
  name: 'inquiries',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentInquiry: (state) => {
      state.currentInquiry = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchInquiries
      .addCase(fetchInquiries.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchInquiries.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.inquiries = action.payload.inquiries; // Assuming API returns {inquiries: [...], count: X}
      })
      .addCase(fetchInquiries.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      // fetchInquiryById
      .addCase(fetchInquiryById.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
        state.currentInquiry = null;
      })
      .addCase(fetchInquiryById.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.currentInquiry = action.payload;
      })
      .addCase(fetchInquiryById.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      // updateInquiryStatus
      .addCase(updateInquiryStatus.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(updateInquiryStatus.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        // Update the inquiry in the inquiries list
        const index = state.inquiries.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) {
          state.inquiries[index] = action.payload;
        }
        // If currentInquiry is the one updated, also update it
        if (state.currentInquiry && state.currentInquiry.id === action.payload.id) {
          state.currentInquiry = action.payload;
        }
      })
      .addCase(updateInquiryStatus.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentInquiry } = inquirySlice.actions;
export default inquirySlice.reducer;
