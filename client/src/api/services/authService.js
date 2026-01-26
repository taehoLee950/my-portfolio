import axiosInstance from "../axiosInstance";

const authService = {
  login: async (adminId, password) => {
    const response = await axiosInstance.post("/auth/login", {
      adminId,
      password,
    });
    return response.data; // { status, data: { accessToken, admin } }
  },

  refresh: async () => {
    const response = await axiosInstance.post("/auth/refresh");
    return response.data; // { status, data: { accessToken } }
  },

  logout: async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  },

  savePushSubscription: async (subscription) => {
    const response = await axiosInstance.post("/auth/push-subscription", {
      subscription,
    });
    return response.data;
  },
};

export default authService;
