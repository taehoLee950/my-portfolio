import axiosInstance from "../axiosInstance";

export const projectService = {
  // 프로젝트 목록 조회
  getProjects: async () => {
    const response = await axiosInstance.get("/projects");
    return response.data;
  },

  // Slug로 상세 조회
  getProjectBySlug: async (slug) => {
    const response = await axiosInstance.get(`/projects/${slug}`);
    return response.data;
  },

  // 프로젝트 생성 (이미지 포함 시 FormData로 전달 권장)
  createProject: async (formData) => {
    const response = await axiosInstance.post("/projects", formData);
    return response.data;
  },

  // 프로젝트 정보 수정 (version 필수 포함)
  updateProject: async (id, updatePayload) => {
    // updatePayload 예시: { title_ko, ..., version: 2 }
    const response = await axiosInstance.patch(`/projects/${id}`, updatePayload);
    return response.data;
  },

  // 프로젝트 삭제
  deleteProject: async (id) => {
    const response = await axiosInstance.delete(`/projects/${id}`);
    return response.data;
  },

  // 이미지 개별 추가
  addProjectImage: async (projectId, imageFile, sortOrder = 0) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("sort_order", sortOrder);
    const response = await axiosInstance.post(
      `/projects/${projectId}/images`,
      formData,
    );
    return response.data;
  },

  // 이미지 삭제
  deleteProjectImage: async (imageId) => {
    const response = await axiosInstance.delete(`/projects/images/${imageId}`);
    return response.data;
  },
};
