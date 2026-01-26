import express from 'express';
const router = express.Router();

import projectController from '../controllers/projectController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';
import { upload } from '../middlewares/upload.js';

// Public routes
router.get('/', apiLimiter, projectController.getAllProjects);
router.get('/:slug', apiLimiter, projectController.getProjectBySlug);

// Admin routes
router.post('/', authenticate, upload.single('image'), projectController.createProject);
router.patch('/:id', authenticate, upload.single('image'), projectController.updateProject);
router.delete('/:id', authenticate, projectController.deleteProject);
router.post('/:projectId/images', authenticate, upload.single('image'), projectController.addProjectImage);
router.delete('/images/:imageId', authenticate, projectController.deleteProjectImage);

export default router;
