import axios from "axios";
import { getAccessToken, setMemoryToken } from "../store/slices/authSlice";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  timeout: 10000,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. 에러가 없거나 이미 재시도한 경우 즉시 종료
    if (!error.response || originalRequest._retry) {
      return Promise.reject(error);
    }

    // 2. 중요: /auth/refresh 요청 자체가 401이 나면 즉시 로그아웃 (무한 루프 방지 핵심)
    if (originalRequest.url.includes("/auth/refresh")) {
      localStorage.removeItem("adminUser");
      window.location.href = "/admin-login"; 
      return Promise.reject(error);
    }

    // 3. 일반 요청이 401이 났을 때만 토큰 갱신 시도
    if (error.response.status === 401) {
      originalRequest._retry = true;
      try {
        // 인터셉터가 없는 "순수 axios"로 갱신 요청 (순환 참조 방지)
        const res = await axios.post(
          `${axiosInstance.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = res.data.data;
        
        // 새로 받은 토큰을 메모리에 업데이트 (authSlice에 setMemoryToken 추가 필요)
        setMemoryToken(accessToken);
        
        // 원래 실패했던 요청 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // 리프레시 실패 시 세션 완전히 종료
        localStorage.removeItem("adminUser");
        window.location.href = "/admin-login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;