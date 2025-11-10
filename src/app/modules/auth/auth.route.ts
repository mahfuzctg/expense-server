import { Router } from 'express';
import { authController } from './auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { registerSchema, loginSchema } from './auth.validation';

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

export default router;

