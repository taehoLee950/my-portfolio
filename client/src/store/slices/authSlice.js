import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../api/services/authService";

// 메모리 토큰 관리 (XSS 방지)
let memoryToken = null;

export const getAccessToken = () => memoryToken;
export const setMemoryToken = (token) => {
  memoryToken = token;
};

// 1. 로그인 액션
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ adminId, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login(adminId, password);
      // 응답 구조가 { status, data: { accessToken, admin } } 인지 확인 임~
      const { accessToken, admin } = response.data; 
      setMemoryToken(accessToken);
      return admin;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "로그인 실패");
    }
  }
);

// 2. 세션 복구 액션 (Silent Refresh)
export const refreshAuth = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refresh();
      const { accessToken } = response.data;
      setMemoryToken(accessToken);
      return true;
    } catch (error) {
      setMemoryToken(null);
      localStorage.removeItem("adminUser");
      return rejectWithValue(false);
    }
  }
);

// 3. 로그아웃 액션 (Navbar에서 사용하는 그 녀석입니다!)
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { dispatch }) => {
    try {
      await authService.logout();
    } finally {
      setMemoryToken(null);
      localStorage.removeItem("adminUser");
      dispatch(authSlice.actions.clearAuth());
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("adminUser")) || null,
    isAuthenticated: !!localStorage.getItem("adminUser"),
    isRefreshing: false, 
  },
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    stopRefreshing: (state) => {
      state.isRefreshing = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        localStorage.setItem("adminUser", JSON.stringify(action.payload));
      })
      .addCase(refreshAuth.pending, (state) => {
        state.isRefreshing = true;
      })
      .addCase(refreshAuth.fulfilled, (state) => {
        state.isAuthenticated = true;
        state.isRefreshing = false;
      })
      .addCase(refreshAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.isRefreshing = false;
      });
  },
});

export const { clearAuth, stopRefreshing } = authSlice.actions;
export default authSlice.reducer;