import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validateEnv } from '../src/config/env-validation';
import { dotEnvSchema } from '../src/schemas/dotEnv.schema';
import { testEnvConfig, setupTestEnvironment } from './test-helpers';

describe('Configuration Integration Tests', () => {
  let module: TestingModule;
  let configService: ConfigService;

  beforeAll(() => {
    setupTestEnvironment();
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          validate: validateEnv,
          isGlobal: true,
        }),
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('Integração ConfigModule + validateEnv', () => {
    it('deve carregar todas as configurações obrigatórias', () => {
      expect(configService.get('NODE_ENV')).toBe('test');
      expect(configService.get('POSTGRESQL_SERVER')).toBe('localhost');
      expect(configService.get('POSTGRESQL_PORT')).toBe('5432');
      expect(configService.get('POSTGRESQL_DATABASE')).toBe('testdb');
      expect(configService.get('POSTGRESQL_USER')).toBe('testuser');
      expect(configService.get('POSTGRESQL_PASSWORD')).toBe('testpass');
    });

    it('deve validar e converter tipos corretamente', () => {
      const port = configService.get('POSTGRESQL_PORT');
      expect(typeof port).toBe('string'); // ConfigService mantém como string
      expect(port).toBe('5432');
    });

    it('deve permitir configurações adicionais não definidas no schema', () => {
      // Define uma variável extra
      process.env.EXTRA_CONFIG = 'extra-value';
      
      expect(configService.get('EXTRA_CONFIG')).toBe('extra-value');
      
      // Limpa após o teste
      delete process.env.EXTRA_CONFIG;
    });
  });

  describe('Schema validation integration', () => {
    it('deve usar o mesmo schema que validateEnv usa internamente', () => {
      const config = {
        NODE_ENV: 'test',
        POSTGRESQL_SERVER: 'localhost',
        POSTGRESQL_PORT: 5432,
        POSTGRESQL_DATABASE: 'testdb',
        POSTGRESQL_USER: 'testuser',
        POSTGRESQL_PASSWORD: 'testpass',
      };

      const { error } = dotEnvSchema.validate(config);
      expect(error).toBeUndefined();

      // As configurações validadas devem estar disponíveis no ConfigService
      expect(configService.get('NODE_ENV')).toBe(config.NODE_ENV);
      expect(configService.get('POSTGRESQL_SERVER')).toBe(config.POSTGRESQL_SERVER);
    });
  });

  describe('Environment-specific configurations', () => {
    it('deve funcionar com NODE_ENV=development', async () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const testModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            validate: validateEnv,
            isGlobal: true,
          }),
        ],
      }).compile();

      const testConfigService = testModule.get<ConfigService>(ConfigService);
      expect(testConfigService.get('NODE_ENV')).toBe('development');

      await testModule.close();
      process.env.NODE_ENV = originalNodeEnv;
    });

    it('deve funcionar com NODE_ENV=production', async () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const testModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            validate: validateEnv,
            isGlobal: true,
          }),
        ],
      }).compile();

      const testConfigService = testModule.get<ConfigService>(ConfigService);
      expect(testConfigService.get('NODE_ENV')).toBe('production');

      await testModule.close();
      process.env.NODE_ENV = originalNodeEnv;
    });
  });

  describe('Error scenarios integration', () => {
    it('deve falhar ao tentar criar módulo com configuração inválida', async () => {
      const originalEnv = { ...process.env };
      
      // Mock process.exit
      const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
      });
      
      // Mock console.error
      const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

      try {
        // Remove uma configuração obrigatória
        delete process.env.POSTGRESQL_SERVER;

        await Test.createTestingModule({
          imports: [
            ConfigModule.forRoot({
              validate: validateEnv,
              isGlobal: true,
            }),
          ],
        }).compile();

        // Se chegou até aqui, o teste falhou
        expect(true).toBe(false);
      } catch (error) {
        expect(error.message).toBe('process.exit called');
        expect(mockExit).toHaveBeenCalledWith(1);
        expect(mockConsoleError).toHaveBeenCalled();
      } finally {
        // Restaura o ambiente
        process.env = originalEnv;
        mockExit.mockRestore();
        mockConsoleError.mockRestore();
      }
    });
  });
});
