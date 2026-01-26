import express from 'express';
const router = express.Router();

import skillCaseController from '../controllers/skillCaseController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';
import { upload } from '../middlewares/upload.js';

// Public routes
router.get('/', apiLimiter, skillCaseController.getAllSkillCases);
router.get('/:id', apiLimiter, skillCaseController.getSkillCaseById);

// Admin routes
router.post('/', authenticate, upload.single('image'), skillCaseController.createSkillCase);
router.put('/:id', authenticate, upload.single('image'), skillCaseController.updateSkillCase);
router.delete('/:id', authenticate, skillCaseController.deleteSkillCase);

export default router;
