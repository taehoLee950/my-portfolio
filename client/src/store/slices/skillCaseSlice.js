import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { skillCaseService } from '../../api/services/skillCaseService';

// 기술 사례 목록 조회
export const fetchSkillCases = createAsyncThunk(
  'skillCases/fetchAll',
  async (category, { rejectWithValue }) => {
    try {
      const response = await skillCaseService.getSkillCases(category);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch skill cases'
      );
    }
  }
);

// 기술 사례 생성 (관리자용)
export const createSkillCase = createAsyncThunk(
  'skillCases/create',
  async (skillCaseData, { rejectWithValue }) => {
    try {
      const response = await skillCaseService.createSkillCase(skillCaseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create skill case'
      );
    }
  }
);

// 기술 사례 수정 (관리자용)
export const updateSkillCase = createAsyncThunk(
  'skillCases/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await skillCaseService.updateSkillCase(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update skill case'
      );
    }
  }
);

// 기술 사례 삭제 (관리자용)
export const deleteSkillCase = createAsyncThunk(
  'skillCases/delete',
  async (id, { rejectWithValue }) => {
    try {
      await skillCaseService.deleteSkillCase(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete skill case'
      );
    }
  }
);

const initialState = {
  skillCases: [],
  loading: 'idle',
  error: null,
};

const skillCaseSlice = createSlice({
  name: 'skillCases',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchSkillCases
      .addCase(fetchSkillCases.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchSkillCases.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.skillCases = action.payload;
      })
      .addCase(fetchSkillCases.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      // createSkillCase
      .addCase(createSkillCase.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(createSkillCase.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.skillCases.unshift(action.payload);
      })
      .addCase(createSkillCase.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      // updateSkillCase
      .addCase(updateSkillCase.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(updateSkillCase.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        const index = state.skillCases.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.skillCases[index] = action.payload;
        }
      })
      .addCase(updateSkillCase.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      // deleteSkillCase
      .addCase(deleteSkillCase.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(deleteSkillCase.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.skillCases = state.skillCases.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteSkillCase.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearError } = skillCaseSlice.actions;
export default skillCaseSlice.reducer;
