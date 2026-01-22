import axiosInstance from '../axiosInstance';

export const projectService = {
  // 프로젝트 목록 조회
  getProjects: async () => {
    const response = await axiosInstance.get('/projects');
    return response.data;
  },

  // 프로젝트 상세 조회
  getProjectById: async (id) => {
    const response = await axiosInstance.get(`/projects/${id}`);
    return response.data;
  },
};
