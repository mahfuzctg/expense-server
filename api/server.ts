import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../src/app/app';
import { connectDB } from '../src/app/config';

let isDatabaseConnected = false;

const ensureDatabaseConnection = async () => {
  if (isDatabaseConnected) {
    return;
  }

  await connectDB();
  isDatabaseConnected = true;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureDatabaseConnection();
  return app(req, res);
}


