import axiosInstance from '../axiosInstance';

export const skillCaseService = {
  // 기술 사례 목록 조회
  getSkillCases: async (category = null) => {
    const params = category ? { category } : {};
    const response = await axiosInstance.get('/skill-cases', { params });
    return response.data;
  },

  // 기술 사례 상세 조회
  getSkillCaseById: async (id) => {
    const response = await axiosInstance.get(`/skill-cases/${id}`);
    return response.data;
  },

  // 기술 사례 생성 (관리자용, FormData 지원)
  createSkillCase: async (data) => {
    const response = await axiosInstance.post('/skill-cases', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 기술 사례 수정 (관리자용, FormData 지원)
  updateSkillCase: async (id, data) => {
    const response = await axiosInstance.put(`/skill-cases/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 기술 사례 삭제 (관리자용)
  deleteSkillCase: async (id) => {
    const response = await axiosInstance.delete(`/skill-cases/${id}`);
    return response.data;
  },
};
