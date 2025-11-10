import { User } from './user.model';
import { IUser, IUserPublic } from './user.interface';
import { RegisterInput } from '../auth/auth.validation';

export class UserService {
  /**
   * Create a new user
   */
  async createUser(data: RegisterInput): Promise<IUser> {
    const user = new User(data);
    return await user.save();
  }

  /**
   * Find user by email
   */
  async findUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select('+password');
  }

  /**
   * Find user by ID
   */
  async findUserById(id: string): Promise<IUserPublic | null> {
    return await User.findById(id).select('-password');
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await User.findOne({ email });
    return !!user;
  }
}

export const userService = new UserService();

