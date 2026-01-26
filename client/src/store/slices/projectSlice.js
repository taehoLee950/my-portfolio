import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectService } from '../../api/services/projectService';

// 프로젝트 목록 조회
export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectService.getProjects();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch projects'
      );
    }
  }
);

// 프로젝트 생성 (관리자용)
export const createProject = createAsyncThunk(
  'projects/create',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await projectService.createProject(projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create project'
      );
    }
  }
);

// 프로젝트 수정 (관리자용)
export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, data, version }, { rejectWithValue }) => {
    try {
      const response = await projectService.updateProject(id, data, version);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update project'
      );
    }
  }
);

// 프로젝트 삭제 (관리자용)
export const deleteProject = createAsyncThunk(
  'projects/delete',
  async (id, { rejectWithValue }) => {
    try {
      await projectService.deleteProject(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete project'
      );
    }
  }
);

const initialState = {
  projects: [],
  loading: 'idle',
  error: null,
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProjects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      // createProject
      .addCase(createProject.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.projects.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      // updateProject
      .addCase(updateProject.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        const index = state.projects.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      })
      // deleteProject
      .addCase(deleteProject.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.projects = state.projects.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearError } = projectSlice.actions;
export default projectSlice.reducer;
