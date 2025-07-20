import * as Joi from 'joi';

export const dotEnvSchema = Joi.object({
  // Configurações gerais
  NODE_ENV: Joi.string().required().valid('development', 'production', 'test'),

  // Banco de dados
  POSTGRESQL_SERVER: Joi.string().required(),
  POSTGRESQL_PORT: Joi.number().required().max(65535),
  POSTGRESQL_DATABASE: Joi.string().required(),
  POSTGRESQL_USER: Joi.string().required(),
  POSTGRESQL_PASSWORD: Joi.string().required(),
});
