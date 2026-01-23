const express = require('express');
const router = express.Router();
const skillCaseController = require('../controllers/skillCaseController');
const { authenticate } = require('../middlewares/authMiddleware');
const { apiLimiter } = require('../middlewares/rateLimiter');

// Public routes
router.get('/', apiLimiter, skillCaseController.getAllSkillCases);
router.get('/:id', apiLimiter, skillCaseController.getSkillCaseById);

// Admin routes
router.post('/', authenticate, skillCaseController.createSkillCase);
router.put('/:id', authenticate, skillCaseController.updateSkillCase);
router.delete('/:id', authenticate, skillCaseController.deleteSkillCase);

module.exports = router;
