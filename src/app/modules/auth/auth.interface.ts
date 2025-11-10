import { IUserPublic } from '../user/user.interface';

export interface IAuthResponse {
  token: string;
  user: IUserPublic;
}

export interface IJwtPayload {
  id: string;
  email: string;
}

