import { Router } from 'express';
import { userController } from './user.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

// Get current user profile (protected route)
router.get('/me', protect, userController.getMe);

// Get a specific user by ID (protected route)
router.get('/:id', protect, userController.getUserById);

export default router;

