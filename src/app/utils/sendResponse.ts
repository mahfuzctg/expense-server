import { Response } from 'express';

interface ResponseData {
  success: boolean;
  message: string;
  data?: any;
  count?: number;
  [key: string]: any;
}

export const sendResponse = (
  res: Response,
  statusCode: number,
  data: ResponseData
) => {
  res.status(statusCode).json(data);
};

