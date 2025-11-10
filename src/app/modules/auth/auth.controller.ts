import { Request, Response } from 'express';
import { authService } from './auth.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AUTH_MESSAGES } from './auth.constant';
import { AuthRequest } from '../../middlewares/auth.middleware';

export class AuthController {
  /**
   * Register a new user
   */
  register = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.setHeader('Authorization', `Bearer ${result.token}`);

    sendResponse(res, 201, {
      success: true,
      message: AUTH_MESSAGES.REGISTER_SUCCESS,
      data: result,
    });
  });

  /**
   * Login user
   */
  login = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.setHeader('Authorization', `Bearer ${result.token}`);

    sendResponse(res, 200, {
      success: true,
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      data: result,
    });
  });

  /**
   * Logout user (client-side token removal, server acknowledgement)
   */
  logout = catchAsync(async (_req: AuthRequest, res: Response) => {
    sendResponse(res, 200, {
      success: true,
      message: AUTH_MESSAGES.LOGOUT_SUCCESS,
    });
  });

  /**
   * Get currently authenticated user
   */
  getMe = catchAsync(async (req: AuthRequest, res: Response) => {
    const user =
      typeof req.user?.toJSON === 'function' ? req.user.toJSON() : req.user;

    sendResponse(res, 200, {
      success: true,
      message: 'Current user retrieved successfully',
      data: user,
    });
  });
}

export const authController = new AuthController();

