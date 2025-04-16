import { z } from 'zod';

export const configSchema = z.object({
  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']),

  // Port
  PORT: z.coerce.number().default(8000),

  // URLs
  BASE_URL: z.string().url(),
  FRONTEND_URL: z.string().url(),

  // Database (PostgreSQL)
  DATABASE_URL: z.string().url().startsWith('postgresql://'),

  // Authentication Secrets
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default('1h'),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),

  // Swagger settings
  SWAGGER_ENABLED: z.coerce.boolean().default(true),
});

export type Config = z.infer<typeof configSchema>;
