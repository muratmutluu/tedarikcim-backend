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

  // JWT Configuration
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.string().default('1d'),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),

  // Swagger settings
  SWAGGER_ENABLED: Joi.boolean().default(true),
});
