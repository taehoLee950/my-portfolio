import axiosInstance from "../axiosInstance";

export const inquiryService = {
  // 일반 사용자 문의 생성
  createInquiry: async (data) => {
    const response = await axiosInstance.post("/inquiries", data);
    return response.data;
  },

  // 문의 목록 조회 (페이지네이션 대응)
  getInquiries: async (page = 1, limit = 50, status = null) => {
    const params = { page, limit };
    if (status) params.status = status;
    const response = await axiosInstance.get("/inquiries", { params });
    return response.data;
  },

  // 상세 조회
  getInquiryById: async (id) => {
    const response = await axiosInstance.get(`/inquiries/${id}`);
    return response.data;
  },

  // 상태 변경 (PATCH /api/inquiries/:id/status)
  updateInquiryStatus: async (id, status) => {
    const response = await axiosInstance.patch(`/inquiries/${id}/status`, {
      status,
    });
    return response.data;
  },
};
