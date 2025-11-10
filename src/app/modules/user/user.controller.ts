import { Response } from 'express';
import { userService } from './user.service';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { ApiError } from '../../utils/ApiError';

export class UserController {
  /**
   * Get current user profile
   */
  getMe = catchAsync(async (req: AuthRequest, res: Response) => {
    const user = await userService.findUserById(req.user!._id);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    sendResponse(res, 200, {
      success: true,
      message: 'User retrieved successfully',
      data: user,
    });
  });
}

export const userController = new UserController();

