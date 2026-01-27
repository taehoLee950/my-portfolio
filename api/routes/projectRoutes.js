import express from "express";
const router = express.Router();

import projectController from "../controllers/projectController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { apiLimiter } from "../middlewares/rateLimiter.js";
import { upload } from "../middlewares/upload.js";

// Public routes
router.get("/", apiLimiter, projectController.getAllProjects);
router.get("/:slug", apiLimiter, projectController.getProjectBySlug);

// Admin routes
// [수정] upload.single('image') -> upload.array('images', 10)
router.post(
  "/",
  authenticate,
  upload.array("images", 10),
  projectController.createProject,
);
router.patch(
  "/:id",
  authenticate,
  upload.array("images", 10),
  projectController.updateProject,
);
router.delete("/:id", authenticate, projectController.deleteProject);

// [수정] 이미지 개별 추가 라우트도 여러 장 대응 가능하게 변경
router.post(
  "/:projectId/images",
  authenticate,
  upload.array("images", 10),
  projectController.addProjectImage,
);
router.delete(
  "/images/:imageId",
  authenticate,
  projectController.deleteProjectImage,
);

export default router;
