import express from 'express';
const router = express.Router();

import skillCaseController from '../controllers/skillCaseController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

// Public routes
router.get('/', apiLimiter, skillCaseController.getAllSkillCases);
router.get('/:id', apiLimiter, skillCaseController.getSkillCaseById);

// Admin routes
router.post('/', authenticate, skillCaseController.createSkillCase);
router.put('/:id', authenticate, skillCaseController.updateSkillCase);
router.delete('/:id', authenticate, skillCaseController.deleteSkillCase);

export default router;
