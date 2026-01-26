import axiosInstance from '../axiosInstance';

export const inquiryService = {
  // 문의 생성
  createInquiry: async (data) => {
    const response = await axiosInstance.post('/inquiries', data);
    return response.data;
  },

  // 문의 목록 조회 (관리자용)
  getInquiries: async () => {
    const response = await axiosInstance.get('/inquiries');
    return response.data;
  },

  // ID로 문의 조회 (관리자용)
  getInquiryById: async (id) => {
    const response = await axiosInstance.get(`/inquiries/${id}`);
    return response.data;
  },

  // 문의 상태 업데이트 (관리자용)
  updateInquiryStatus: async (id, status) => {
    const response = await axiosInstance.patch(`/inquiries/${id}/status`, { status });
    return response.data;
  },
};
