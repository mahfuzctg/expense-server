import { Response } from 'express';
import { Request } from 'express';
import { authService } from './auth.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AUTH_MESSAGES } from './auth.constant';

export class AuthController {
  /**
   * Register a new user
   */
  register = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);

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

    sendResponse(res, 200, {
      success: true,
      message: AUTH_MESSAGES.LOGIN_SUCCESS,
      data: result,
    });
  });
}

export const authController = new AuthController();

