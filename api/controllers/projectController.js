import asyncHandler from '../utils/asyncHandler.js';
import projectService from '../services/projectService.js';

const projectController = {
  // 모든 프로젝트 조회
  getAllProjects: asyncHandler(async (req, res, next) => {
    const projects = await projectService.getAllProjects();

    res.status(200).json({
      status: 'success',
      data: projects,
    });
  }),

  // Slug로 프로젝트 조회
  getProjectBySlug: asyncHandler(async (req, res, next) => {
    const { slug } = req.params;
    const project = await projectService.getProjectBySlug(slug);

    res.status(200).json({
      status: 'success',
      data: project,
    });
  }),

  // 프로젝트 생성 (관리자용, 이미지 업로드 포함)
  createProject: asyncHandler(async (req, res, next) => {
    const projectData = { ...req.body };
    
    // 이미지 파일이 있으면 URL 생성
    if (req.file) {
      const imageUrl = `/api/static/${req.file.filename}`;
      const project = await projectService.createProject(projectData);
      
      // 썸네일 이미지 추가
      await projectService.addProjectImage(project.id, {
        image_url: imageUrl,
        sort_order: 0,
      });
      
      const projectWithImage = await projectService.getProjectById(project.id);
      return res.status(201).json({
        status: 'success',
        data: projectWithImage,
      });
    }

    const project = await projectService.createProject(projectData);
    res.status(201).json({
      status: 'success',
      data: project,
    });
  }),

  // 프로젝트 수정 (관리자용, 낙관적 락)
  updateProject: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { version } = req.body;

    if (version === undefined) {
      return res.status(400).json({
        status: 'fail',
        message: 'Version is required for update',
      });
    }

    const project = await projectService.updateProject(id, req.body, version);

    res.status(200).json({
      status: 'success',
      data: project,
    });
  }),

  // 프로젝트 삭제 (관리자용)
  deleteProject: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    await projectService.deleteProject(id);

    res.status(200).json({
      status: 'success',
      message: 'Project deleted successfully',
    });
  }),

  // 이미지 추가 (관리자용, 파일 업로드)
  addProjectImage: asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;
    
    if (!req.file) {
      return res.status(400).json({
        status: 'fail',
        message: 'Image file is required',
      });
    }

    const imageUrl = `/api/static/${req.file.filename}`;
    const imageData = {
      image_url: imageUrl,
      sort_order: req.body.sort_order || 0,
    };

    const image = await projectService.addProjectImage(projectId, imageData);

    res.status(201).json({
      status: 'success',
      data: image,
    });
  }),

  // 이미지 삭제 (관리자용)
  deleteProjectImage: asyncHandler(async (req, res, next) => {
    const { imageId } = req.params;
    await projectService.deleteProjectImage(imageId);

    res.status(200).json({
      status: 'success',
      message: 'Image deleted successfully',
    });
  }),
};

export default projectController;
