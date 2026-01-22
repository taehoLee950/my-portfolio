import axiosInstance from '../axiosInstance';

export const inquiryService = {
  // 문의 생성
  createInquiry: async (data) => {
    const response = await axiosInstance.post('/inquiries', data);
    return response.data;
  },

  // 문의 목록 조회 (관리자용 - 추후 추가)
  // getInquiries: async () => {
  //   const response = await axiosInstance.get('/inquiries');
  //   return response.data;
  // },
};
