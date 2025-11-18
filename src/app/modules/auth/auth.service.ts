import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { config } from '../../config';
import { userService } from '../user/user.service';
import { IAuthResponse, IJwtPayload } from './auth.interface';
import { RegisterInput, LoginInput } from './auth.validation';
import { AUTH_MESSAGES } from './auth.constant';
import { ApiError } from '../../utils/ApiError';

export class AuthService {
  /**
   * Generate JWT token
   */
  generateToken(payload: IJwtPayload): string {
    const secret = config.jwtSecret as Secret;
    const options: SignOptions = {
      expiresIn: config.jwtExpiresIn as unknown as SignOptions['expiresIn'],
    };

    return jwt.sign(payload, secret, options);
  }

  /**
   * Register a new user
   */
  async register(data: RegisterInput): Promise<IAuthResponse> {
    // Check if email already exists
    const emailExists = await userService.emailExists(data.email);
    if (emailExists) {
      throw new ApiError(400, AUTH_MESSAGES.EMAIL_EXISTS);
    }

    // Create user
    const user = await userService.createUser(data);

    // Generate token
    const token = this.generateToken({
      id: user._id.toString(),
      email: user.email,
    });

    // Remove password from user object
    const userPublic = await userService.findUserById(user._id.toString());
    if (!userPublic) {
      throw new ApiError(500, 'Failed to create user');
    }

    return {
      token,
      user: userPublic,
    };
  }

  /**
   * Login user
   */
  async login(data: LoginInput): Promise<IAuthResponse> {
    // Find user by email (include password)
    const user = await userService.findUserByEmail(data.email);
    if (!user) {
      throw new ApiError(401, AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    // Check password
    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw new ApiError(401, AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    // Generate token
    const token = this.generateToken({
      id: user._id.toString(),
      email: user.email,
    });

    // Remove password from user object
    const userPublic = await userService.findUserById(user._id.toString());
    if (!userPublic) {
      throw new ApiError(500, 'Failed to retrieve user');
    }

    return {
      token,
      user: userPublic,
    };
  }
}

export const authService = new AuthService();

