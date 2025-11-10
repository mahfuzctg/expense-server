import { Router } from 'express';
import { authController } from './auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { registerSchema, loginSchema } from './auth.validation';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

// Register a new user
router.post(
  '/register',
  validateRequest(registerSchema),
  authController.register
);

// Login user
router.post(
  '/login',
  validateRequest(loginSchema),
  authController.login
);

// Logout user
router.post('/logout', protect, authController.logout);

// Get current user
router.get('/me', protect, authController.getMe);

export default router;

