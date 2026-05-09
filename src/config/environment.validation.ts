import * as Joi from 'joi';

/**
 * Joi schema validated on startup when ConfigModule loads environment variables
 */
export const environmentValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_TYPE: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.boolean().required(),
  DB_AUTO_LOAD_ENTITIES: Joi.boolean().required(),

  // Test
  USER_SCOPE_KEY: Joi.string().required(),
});
