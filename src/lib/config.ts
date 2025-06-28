import { envSchema } from './validations';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate environment variables
const envResult = envSchema.safeParse(process.env);

if (!envResult.success) {
  console.error(' Invalid environment variables:');
  console.error(envResult.error.format());
  process.exit(1);
}

export const config = envResult.data;

// Export individual config values for convenience
export const {
  DATABASE_URL,
  JWT_SECRET,
  PORT,
  NODE_ENV
} = config; 