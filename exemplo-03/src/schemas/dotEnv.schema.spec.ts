import * as Joi from 'joi';
import { dotEnvSchema } from './dotEnv.schema';

describe('dotEnvSchema', () => {
  describe('validação bem-sucedida', () => {
    it('deve validar configuração completa e válida', () => {
      const validConfig = {
        NODE_ENV: 'development',
        POSTGRESQL_SERVER: 'localhost',
        POSTGRESQL_PORT: 5432,
        POSTGRESQL_DATABASE: 'myapp',
        POSTGRESQL_USER: 'postgres',
        POSTGRESQL_PASSWORD: 'password123',
      };

      const { error, value } = dotEnvSchema.validate(validConfig);

      expect(error).toBeUndefined();
      expect(value).toEqual(validConfig);
    });

    it('deve aceitar todos os valores válidos de NODE_ENV', () => {
      const envValues = ['development', 'production', 'test'];

      envValues.forEach(env => {
        const config = {
          NODE_ENV: env,
          POSTGRESQL_SERVER: 'localhost',
          POSTGRESQL_PORT: 5432,
          POSTGRESQL_DATABASE: 'myapp',
          POSTGRESQL_USER: 'postgres',
          POSTGRESQL_PASSWORD: 'password123',
        };

        const { error } = dotEnvSchema.validate(config);
        expect(error).toBeUndefined();
      });
    });

    it('deve aceitar portas válidas do PostgreSQL', () => {
      const validPorts = [0, 1, 5432, 5433, 65535]; // Joi.port() aceita 0 e 1

      validPorts.forEach(port => {
        const config = {
          NODE_ENV: 'development',
          POSTGRESQL_SERVER: 'localhost',
          POSTGRESQL_PORT: port,
          POSTGRESQL_DATABASE: 'myapp',
          POSTGRESQL_USER: 'postgres',
          POSTGRESQL_PASSWORD: 'password123',
        };

        const { error } = dotEnvSchema.validate(config);
        expect(error).toBeUndefined();
      });
    });
  });

  describe('validação com falhas', () => {
    it('deve falhar quando NODE_ENV está ausente', () => {
      const config = {
        POSTGRESQL_SERVER: 'localhost',
        POSTGRESQL_PORT: 5432,
        POSTGRESQL_DATABASE: 'myapp',
        POSTGRESQL_USER: 'postgres',
        POSTGRESQL_PASSWORD: 'password123',
      };

      const { error } = dotEnvSchema.validate(config);

      expect(error).toBeDefined();
      expect(error?.details[0].path).toEqual(['NODE_ENV']);
      expect(error?.details[0].type).toBe('any.required');
    });

    it('deve falhar quando NODE_ENV tem valor inválido', () => {
      const config = {
        NODE_ENV: 'staging',
        POSTGRESQL_SERVER: 'localhost',
        POSTGRESQL_PORT: 5432,
        POSTGRESQL_DATABASE: 'myapp',
        POSTGRESQL_USER: 'postgres',
        POSTGRESQL_PASSWORD: 'password123',
      };

      const { error } = dotEnvSchema.validate(config);

      expect(error).toBeDefined();
      expect(error?.details[0].path).toEqual(['NODE_ENV']);
      expect(error?.details[0].type).toBe('any.only');
    });

    it('deve falhar quando POSTGRESQL_SERVER está ausente', () => {
      const config = {
        NODE_ENV: 'development',
        POSTGRESQL_PORT: 5432,
        POSTGRESQL_DATABASE: 'myapp',
        POSTGRESQL_USER: 'postgres',
        POSTGRESQL_PASSWORD: 'password123',
      };

      const { error } = dotEnvSchema.validate(config);

      expect(error).toBeDefined();
      expect(error?.details[0].path).toEqual(['POSTGRESQL_SERVER']);
      expect(error?.details[0].type).toBe('any.required');
    });

    it('deve falhar quando POSTGRESQL_PORT não é um número', () => {
      const config = {
        NODE_ENV: 'development',
        POSTGRESQL_SERVER: 'localhost',
        POSTGRESQL_PORT: 'not-a-number',
        POSTGRESQL_DATABASE: 'myapp',
        POSTGRESQL_USER: 'postgres',
        POSTGRESQL_PASSWORD: 'password123',
      };

      const { error } = dotEnvSchema.validate(config);

      expect(error).toBeDefined();
      expect(error?.details[0].path).toEqual(['POSTGRESQL_PORT']);
      expect(error?.details[0].type).toBe('number.base');
    });

    it('deve falhar quando POSTGRESQL_PORT está fora do range válido', () => {
      const invalidPorts = [65536, 70000]; // 0 e 1 são considerados válidos pelo Joi.port()

      invalidPorts.forEach(port => {
        const config = {
          NODE_ENV: 'development',
          POSTGRESQL_SERVER: 'localhost',
          POSTGRESQL_PORT: port,
          POSTGRESQL_DATABASE: 'myapp',
          POSTGRESQL_USER: 'postgres',
          POSTGRESQL_PASSWORD: 'password123',
        };

        const { error } = dotEnvSchema.validate(config);
        expect(error).toBeDefined();
        expect(error?.details.some(detail => detail.path.includes('POSTGRESQL_PORT'))).toBeTruthy();
      });
    });

    it('deve falhar quando POSTGRESQL_DATABASE está ausente', () => {
      const config = {
        NODE_ENV: 'development',
        POSTGRESQL_SERVER: 'localhost',
        POSTGRESQL_PORT: 5432,
        POSTGRESQL_USER: 'postgres',
        POSTGRESQL_PASSWORD: 'password123',
      };

      const { error } = dotEnvSchema.validate(config);

      expect(error).toBeDefined();
      expect(error?.details[0].path).toEqual(['POSTGRESQL_DATABASE']);
      expect(error?.details[0].type).toBe('any.required');
    });

    it('deve falhar quando POSTGRESQL_USER está ausente', () => {
      const config = {
        NODE_ENV: 'development',
        POSTGRESQL_SERVER: 'localhost',
        POSTGRESQL_PORT: 5432,
        POSTGRESQL_DATABASE: 'myapp',
        POSTGRESQL_PASSWORD: 'password123',
      };

      const { error } = dotEnvSchema.validate(config);

      expect(error).toBeDefined();
      expect(error?.details[0].path).toEqual(['POSTGRESQL_USER']);
      expect(error?.details[0].type).toBe('any.required');
    });

    it('deve falhar quando POSTGRESQL_PASSWORD está ausente', () => {
      const config = {
        NODE_ENV: 'development',
        POSTGRESQL_SERVER: 'localhost',
        POSTGRESQL_PORT: 5432,
        POSTGRESQL_DATABASE: 'myapp',
        POSTGRESQL_USER: 'postgres',
      };

      const { error } = dotEnvSchema.validate(config);

      expect(error).toBeDefined();
      expect(error?.details[0].path).toEqual(['POSTGRESQL_PASSWORD']);
      expect(error?.details[0].type).toBe('any.required');
    });

    it('deve retornar múltiplos erros quando múltiplos campos são inválidos', () => {
      const config = {
        NODE_ENV: 'invalid',
        POSTGRESQL_PORT: 'not-a-number',
        // Faltando outros campos obrigatórios
      };

      const { error } = dotEnvSchema.validate(config, { abortEarly: false });

      expect(error).toBeDefined();
      expect(error?.details).toHaveLength(6); // NODE_ENV inválido + POSTGRESQL_PORT inválido + 4 campos obrigatórios faltando
    });
  });

  describe('conversão de tipos', () => {
    it('deve converter string numérica para number em POSTGRESQL_PORT', () => {
      const config = {
        NODE_ENV: 'development',
        POSTGRESQL_SERVER: 'localhost',
        POSTGRESQL_PORT: '5432', // String que representa um número
        POSTGRESQL_DATABASE: 'myapp',
        POSTGRESQL_USER: 'postgres',
        POSTGRESQL_PASSWORD: 'password123',
      };

      const { error, value } = dotEnvSchema.validate(config);

      expect(error).toBeUndefined();
      expect(typeof value.POSTGRESQL_PORT).toBe('number');
      expect(value.POSTGRESQL_PORT).toBe(5432);
    });
  });
});
