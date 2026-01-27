import asyncHandler from "../utils/asyncHandler.js";
import projectService from "../services/projectService.js";

const projectController = {
  // 모든 프로젝트 조회
  getAllProjects: asyncHandler(async (req, res, next) => {
    const projects = await projectService.getAllProjects();

    res.status(200).json({
      status: "success",
      data: projects,
    });
  }),

  // Slug로 프로젝트 조회
  getProjectBySlug: asyncHandler(async (req, res, next) => {
    const { slug } = req.params;
    const project = await projectService.getProjectBySlug(slug);

    res.status(200).json({
      status: "success",
      data: project,
    });
  }),

  // 프로젝트 생성 (여러 이미지 업로드 처리)
  createProject: asyncHandler(async (req, res, next) => {
    const projectData = { ...req.body };

    // 1. 기본 프로젝트 정보 생성
    const project = await projectService.createProject(projectData);

    // 2. [수정] 여러 이미지 파일 처리 (req.files 사용)
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map((file, index) => {
        const imageUrl = `/api/static/${file.filename}`;
        return projectService.addProjectImage(project.id, {
          image_url: imageUrl,
          sort_order: index, // 업로드 순서대로 인덱스 부여
        });
      });

      await Promise.all(imagePromises);
    }

    const projectWithImages = await projectService.getProjectById(project.id);
    res.status(201).json({
      status: "success",
      data: projectWithImages,
    });
  }),

  // 프로젝트 수정 (낙관적 락)
  updateProject: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { version } = req.body;

    if (version === undefined) {
      return res.status(400).json({
        status: "fail",
        message: "Version is required for update",
      });
    }

    // 프로젝트 정보 업데이트
    await projectService.updateProject(id, req.body, version);

    // [수정] 수정 시에도 이미지가 추가로 들어왔을 경우 처리
    if (req.files && req.files.length > 0) {
      const imagePromises = req.files.map((file, index) => {
        const imageUrl = `/api/static/${file.filename}`;
        return projectService.addProjectImage(id, {
          image_url: imageUrl,
          sort_order: index,
        });
      });
      await Promise.all(imagePromises);
    }

    const updatedProject = await projectService.getProjectById(id);
    res.status(200).json({
      status: "success",
      data: updatedProject,
    });
  }),

  // 프로젝트 삭제
  deleteProject: asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    await projectService.deleteProject(id);

    res.status(200).json({
      status: "success",
      message: "Project deleted successfully",
    });
  }),

  // 이미지 추가 (여러 장 한 번에 추가 가능하도록 변경)
  addProjectImage: asyncHandler(async (req, res, next) => {
    const { projectId } = req.params;

    // [수정] req.files 확인
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Image files are required",
      });
    }

    const imagePromises = req.files.map((file, index) => {
      const imageUrl = `/api/static/${file.filename}`;
      return projectService.addProjectImage(projectId, {
        image_url: imageUrl,
        sort_order: req.body.sort_order || index,
      });
    });

    const savedImages = await Promise.all(imagePromises);

    res.status(201).json({
      status: "success",
      data: savedImages,
    });
  }),

  // 이미지 삭제
  deleteProjectImage: asyncHandler(async (req, res, next) => {
    const { imageId } = req.params;
    await projectService.deleteProjectImage(imageId);

    res.status(200).json({
      status: "success",
      message: "Image deleted successfully",
    });
  }),
};

export default projectController;
