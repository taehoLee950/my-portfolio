import axiosInstance from "../axiosInstance";

export const skillCaseService = {
  // 기술 사례 목록 조회 (필터 지원)
  getSkillCases: async (category = null) => {
    const params = category ? { category } : {};
    const response = await axiosInstance.get("/skill-cases", { params });
    return response.data;
  },

  // 상세 조회
  getSkillCaseById: async (id) => {
    const response = await axiosInstance.get(`/skill-cases/${id}`);
    return response.data;
  },

  // 생성 (FormData 사용: image, skill_name, content_ko 등)
  createSkillCase: async (formData) => {
    const response = await axiosInstance.post("/skill-cases", formData);
    return response.data;
  },

  // 수정 (FormData 사용: 이미지 변경 대응)
  updateSkillCase: async (id, formData) => {
    const response = await axiosInstance.patch(`/skill-cases/${id}`, formData);
    return response.data;
  },

  // 삭제
  deleteSkillCase: async (id) => {
    const response = await axiosInstance.delete(`/skill-cases/${id}`);
    return response.data;
  },
};
