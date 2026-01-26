import AppError from '../utils/appError.js';
import projectRepository from '../repositories/projectRepository.js';

const projectService = {
  // 모든 프로젝트 조회
  getAllProjects: async () => {
    try {
      const projects = await projectRepository.findAll();
      return projects;
    } catch (error) {
      throw new AppError('Failed to fetch projects', 500, 'FETCH_ERROR');
    }
  },

  // Slug로 프로젝트 조회
  getProjectBySlug: async (slug) => {
    const project = await projectRepository.findBySlug(slug);
    if (!project) {
      throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    }
    return project;
  },

  // ID로 프로젝트 조회 (내부용)
  getProjectById: async (id) => {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    }
    return project;
  },

  // 프로젝트 생성
  createProject: async (data) => {
    try {
      // Slug 중복 체크
      const existing = await projectRepository.findBySlug(data.slug);
      if (existing) {
        throw new AppError('Project with this slug already exists', 409, 'DUPLICATE_SLUG');
      }

      const project = await projectRepository.create(data);
      return project;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create project', 500, 'CREATE_ERROR');
    }
  },

  // 프로젝트 수정 (낙관적 락)
  updateProject: async (id, data, currentVersion) => {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    }

    // 버전 체크
    if (currentVersion !== project.version) {
      throw new AppError(
        'Project has been modified by another user. Please refresh and try again.',
        409,
        'VERSION_CONFLICT'
      );
    }

    const updated = await projectRepository.update(id, data, currentVersion);
    if (!updated) {
      throw new AppError('Failed to update project. Version conflict.', 409, 'UPDATE_FAILED');
    }

    return await projectRepository.findById(id);
  },

  // 프로젝트 삭제
  deleteProject: async (id) => {
    const project = await projectRepository.findById(id);
    if (!project) {
      throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    }

    await projectRepository.delete(id);
    return { message: 'Project deleted successfully' };
  },

  // 이미지 추가
  addProjectImage: async (projectId, imageData) => {
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new AppError('Project not found', 404, 'PROJECT_NOT_FOUND');
    }

    return await projectRepository.addImage(projectId, imageData);
  },

  // 이미지 삭제
  deleteProjectImage: async (imageId) => {
    await projectRepository.deleteImage(imageId);
    return { message: 'Image deleted successfully' };
  },
};

export default projectService;
