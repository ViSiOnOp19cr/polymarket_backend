import { z } from 'zod';
import { MarketCatagory, BetOutcome } from '@prisma/client';

// User validations
export const signupSchema = z.object({
  email: z.string()
    .email("Invalid email")
    .min(3, "Email must be at least 3 characters"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password must be at most 30 characters")
});

export const signinSchema = signupSchema;

// Bet validations
export const placeBetSchema = z.object({
  amount: z.number()
    .positive("Amount must be positive")
    .int("Amount must be an integer"),
  marketId: z.number()
    .positive("Market ID must be positive")
    .int("Market ID must be an integer"),
  outcome_chosen: z.enum(["YES", "NO"] as const, {
    errorMap: () => ({ message: "Outcome must be either YES or NO" })
  })
});

// Market validations
export const createMarketSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  description: z.string()
    .min(1, "Description is required")
    .max(1000, "Description must be at most 1000 characters"),
  end_time: z.string()
    .refine((date) => new Date(date) > new Date(), {
      message: "End time must be in the future"
    }),
  catagory: z.enum(["Sports", "Esports"] as const, {
    errorMap: () => ({ message: "Category must be either Sports or Esports" })
  })
});

export const updateMarketSchema = createMarketSchema.partial();

export const resolveMarketSchema = z.object({
  outcome: z.enum(["YES", "NO"] as const, {
    errorMap: () => ({ message: "Outcome must be either YES or NO" })
  })
});

// ID validations
export const idParamSchema = z.object({
  id: z.string()
    .refine((val) => !isNaN(parseInt(val)), "ID must be a number")
    .transform((val) => parseInt(val))
});

export const categoryParamSchema = z.object({
  catagory: z.enum(["Sports", "Esports"] as const, {
    errorMap: () => ({ message: "Category must be either Sports or Esports" })
  })
});

// Query validations
export const searchQuerySchema = z.object({
  title: z.string()
    .min(1, "Title query is required")
    .max(100, "Title query must be at most 100 characters")
});

// Pagination validation
export const paginationSchema = z.object({
  page: z.string()
    .regex(/^\d+$/, "Page must be a number")
    .optional()
    .default("1")
    .transform((val) => parseInt(val)),
  limit: z.string()
    .regex(/^\d+$/, "Limit must be a number")
    .optional()
    .default("10")
    .transform((val) => Math.min(parseInt(val), 100)) // Max 100 items per page
});

// Environment variables validation
export const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  PORT: z.string().regex(/^\d+$/, "PORT must be a number").optional().default("3005"),
  NODE_ENV: z.enum(["development", "production", "test"]).optional().default("development"),
});

// Helper function to validate request data
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.errors
      .map(err => `${err.path.join('.')}: ${err.message}`)
      .join(', ');
    return { success: false, error: errors };
  }
  
  return { success: true, data: result.data };
} 