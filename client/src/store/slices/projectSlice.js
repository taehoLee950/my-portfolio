import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { projectService } from "../../api/services/projectService";

// 프로젝트 목록 조회
export const fetchProjects = createAsyncThunk(
  "projects/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await projectService.getProjects();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch projects",
      );
    }
  },
);

// 프로젝트 생성 (관리자용)
export const createProject = createAsyncThunk(
  "projects/create",
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await projectService.createProject(projectData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create project",
      );
    }
  },
);

// 프로젝트 수정 (관리자용)
export const updateProject = createAsyncThunk(
  "projects/update",
  async ({ id, data, version }, { rejectWithValue }) => {
    try {
      const response = await projectService.updateProject(id, data, version);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update project",
      );
    }
  },
);

// 프로젝트 삭제 (관리자용)
export const deleteProject = createAsyncThunk(
  "projects/delete",
  async (id, { rejectWithValue }) => {
    try {
      await projectService.deleteProject(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete project",
      );
    }
  },
);

// 프로젝트 이미지 추가 (관리자용)
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

// 프로젝트 이미지 삭제 (관리자용)
export const deleteProjectImage = createAsyncThunk(
  "projects/deleteImage",
  async ({ projectId, imageId }, { rejectWithValue }) => {
    try {
      await projectService.deleteProjectImage(imageId);
      return { projectId, imageId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete project image",
      );
    }
  },
);

const initialState = {
  projects: [],
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = "succeeded";
        // 백엔드 응답이 { data: [...] } 형식이므로 .data를 참조합니다.
        state.projects = action.payload.data || action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })
      .addCase(createProject.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = "succeeded";
        const newProject = action.payload.data || action.payload;
        state.projects.unshift(newProject);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })
      .addCase(updateProject.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = "succeeded";
        const updated = action.payload.data || action.payload;
        const index = state.projects.findIndex((p) => p.id === updated.id);
        if (index !== -1) {
          state.projects[index] = updated;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })
      .addCase(deleteProject.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.projects = state.projects.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload;
      })
      .addCase(addProjectImage.fulfilled, (state, action) => {
        const { projectId, image } = action.payload;
        const imgData = image.data || image;
        const project = state.projects.find((p) => p.id === projectId);
        if (project) {
          project.images = project.images
            ? [...project.images, imgData]
            : [imgData];
        }
      })
      .addCase(deleteProjectImage.fulfilled, (state, action) => {
        const { projectId, imageId } = action.payload;
        const project = state.projects.find((p) => p.id === projectId);
        if (project && project.images) {
          project.images = project.images.filter((img) => img.id !== imageId);
        }
      });
  },
});

export const { clearError } = projectSlice.actions;
export default projectSlice.reducer;
