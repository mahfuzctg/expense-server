import { Router } from 'express';
import { userController } from './user.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

// Get current user profile (protected route)
router.get('/me', protect, userController.getMe);

export default router;

