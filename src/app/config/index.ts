import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  mongoUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  jwtCookieExpiresIn: number;
}

// Helper function to fetch environment variables with fallback and validation
const getEnvVar = (key: string, fallback?: string, required = false): string => {
  const value = process.env[key] || fallback;
  if (required && (typeof value === 'undefined' || value === '')) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || '';
};

export const config: Config = {
  port: Number(getEnvVar('PORT', '3000')),
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  mongoUri: getEnvVar('MONGO_URI', '*', true),
  jwtSecret: getEnvVar('JWT_SECRET', 'jhdhdjeuiuerujdfjdjjjdjueueudjdj', true),
  jwtExpiresIn: getEnvVar('JWT_EXPIRES_IN', '7d'),
  jwtCookieExpiresIn: Number(getEnvVar('JWT_COOKIE_EXPIRES_IN', '7')),
};

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Unified MongoDB event handler
const mongoEventLogger = (event: string, error?: unknown) => {
  const messages: Record<string, string> = {
    disconnected: '⚠️ MongoDB disconnected',
    error: `❌ MongoDB error: ${error}`,
  };
  // Fallback to console.error if event is error with error obj, console.log otherwise
  if (event === 'error') {
    console.error(messages[event]);
  } else {
    console.log(messages[event]);
  }
};

mongoose.connection.on('disconnected', () => mongoEventLogger('disconnected'));
mongoose.connection.on('error', (error) => mongoEventLogger('error', error));

