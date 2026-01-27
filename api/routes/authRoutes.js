import express from 'express';
const router = express.Router();

import authController from '../controllers/authController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { loginLimiter } from '../middlewares/rateLimiter.js';

router.post('/login', loginLimiter, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post(
  '/push-subscription',
  authenticate,
  authController.savePushSubscription
);

export default router;
