import * as Joi from 'joi';

export const configSchema = Joi.object({
  // Environment
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),

  // Port
  PORT: Joi.number().default(8000),

  // URLs
  BASE_URL: Joi.string().uri().required(),
  FRONTEND_URL: Joi.string().uri().required(),

  // Database (PostgreSQL)
  DATABASE_URL: Joi.string()
    .uri()
    .pattern(/^postgresql:\/\//)
    .required(),

  // Authentication Secrets
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  ACCESS_TOKEN_EXPIRES_IN: Joi.string().default('1h'),
  REFRESH_TOKEN_EXPIRES_IN: Joi.string().default('7d'),

  // Swagger settings
  SWAGGER_ENABLED: Joi.boolean().default(true),
});
