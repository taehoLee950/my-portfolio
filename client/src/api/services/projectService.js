import axiosInstance from '../axiosInstance';

export const projectService = {
  // 프로젝트 목록 조회
  getProjects: async () => {
    const response = await axiosInstance.get('/projects');
    return response.data;
  },

  // Slug로 프로젝트 조회
  getProjectBySlug: async (slug) => {
    const response = await axiosInstance.get(`/projects/${slug}`);
    return response.data;
  },

  // 프로젝트 생성 (관리자용, FormData 지원)
  createProject: async (data) => {
    const response = await axiosInstance.post('/projects', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 프로젝트 수정 (관리자용)
  updateProject: async (id, data, version) => {
    const response = await axiosInstance.put(`/projects/${id}`, {
      ...data,
      version,
    });
    return response.data;
  },

  // 프로젝트 삭제 (관리자용)
  deleteProject: async (id) => {
    const response = await axiosInstance.delete(`/projects/${id}`);
    return response.data;
  },

  // 프로젝트 이미지 추가 (관리자용, FormData 지원)
  addProjectImage: async (projectId, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const response = await axiosInstance.post(`/projects/${projectId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // 프로젝트 이미지 삭제 (관리자용)
  deleteProjectImage: async (imageId) => {
    const response = await axiosInstance.delete(`/projects/images/${imageId}`);
    return response.data;
  },
};
