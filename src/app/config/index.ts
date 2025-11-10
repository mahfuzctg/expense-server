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

const DEFAULT_MONGO_URI = 'mongodb://127.0.0.1:27017/expense_insight';

// Helper function to fetch environment variables with fallback and validation
const getEnvVar = (key: string, fallback?: string, required = false): string => {
  const rawValue = process.env[key];

  if (rawValue && rawValue.trim() !== '') {
    return rawValue.trim();
  }

  if (required) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  if (typeof fallback !== 'undefined') {
    if (!rawValue) {
      console.warn(
        `Environment variable ${key} not set. Falling back to default value.`
      );
    }
    return fallback;
  }

  return '';
};

export const config: Config = {
  port: Number(getEnvVar('PORT', '5000')),
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  mongoUri: getEnvVar('MONGO_URI', DEFAULT_MONGO_URI),
  jwtSecret: getEnvVar('JWT_SECRET', undefined, true),
  jwtExpiresIn: getEnvVar('JWT_EXPIRES_IN', '7d'),
  jwtCookieExpiresIn: Number(getEnvVar('JWT_COOKIE_EXPIRES_IN', '7')),
};

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
};

// Unified MongoDB event handler
const mongoEventLogger = (event: string, error?: unknown) => {
  const messages: Record<string, string> = {
    connected: '✅ MongoDB connection established',
    disconnected: '⚠️ MongoDB disconnected',
    error: `❌ MongoDB error: ${error}`,
  };
  if (event === 'error') {
    console.error(messages[event]);
  } else {
    console.log(messages[event]);
  }
};

mongoose.connection.on('connected', () => mongoEventLogger('connected'));
mongoose.connection.on('disconnected', () => mongoEventLogger('disconnected'));
mongoose.connection.on('error', (error) => mongoEventLogger('error', error));

