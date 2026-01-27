import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { projectService } from "../../api/services/projectService";

// 1. 프로젝트 목록 조회
export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectService.getProjects();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch projects",
      );
    }
  },
);

// 2. 프로젝트 상세 조회 (Slug 기준)
export const fetchProjectBySlug = createAsyncThunk(
  "projects/fetchBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await projectService.getProjectBySlug(slug);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch project detail",
      );
    }
  },
);

// 3. 프로젝트 생성
export const createProject = createAsyncThunk(
  "projects/create",
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await projectService.createProject(projectData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create project",
      );
    }
  },
);

// 4. 프로젝트 수정
export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await projectService.updateProject(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update project",
      );
    }
  },
);

// 5. 프로젝트 삭제 [복구]
export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (id, { rejectWithValue }) => {
    try {
      await projectService.deleteProject(id);
      return id; // 삭제는 ID만 반환
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete project",
      );
    }
  },
);

// 6. 이미지 추가 [복구]
export const addProjectImage = createAsyncThunk(
  "projects/addImage",
  async ({ projectId, imageFile }, { rejectWithValue }) => {
    try {
      const response = await projectService.addProjectImage(
        projectId,
        imageFile,
      );
      return { projectId, image: response.data };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add project image",
      );
    }
  },
);

const initialState = {
  projects: [],
  currentProject: null,
  loading: "idle",
  error: null,
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 목록 조회
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.projects = action.payload.data || [];
      })
      // 상세 조회
      .addCase(fetchProjectBySlug.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.currentProject = action.payload.data;
      })
      // 생성
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = "succeeded";
        const newProject = action.payload.data;
        if (newProject) state.projects.unshift(newProject);
      })
      // 수정
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = "succeeded";
        const updated = action.payload.data;
        if (updated) {
          const index = state.projects.findIndex((p) => p.id === updated.id);
          if (index !== -1) state.projects[index] = updated;
          if (state.currentProject?.id === updated.id)
            state.currentProject = updated;
        }
      })
      // 삭제 [복구]
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.projects = state.projects.filter((p) => p.id !== action.payload);
      })
      // 이미지 추가 [복구]
      .addCase(addProjectImage.fulfilled, (state, action) => {
        const { projectId, image } = action.payload;
        const project = state.projects.find((p) => p.id === projectId);
        if (project) {
          project.images = project.images
            ? [...project.images, image]
            : [image];
        }
      })
      // Rejected 케이스 공통 처리
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = "failed";
          state.error = action.payload;
        },
      );
  },
});

export const { clearError, clearCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
