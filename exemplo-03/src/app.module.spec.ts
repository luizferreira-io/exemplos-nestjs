import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validateEnv } from './config/env-validation';

describe('AppModule', () => {
  let module: TestingModule;
  let appController: AppController;
  let appService: AppService;
  let configService: ConfigService;

  // Mock das variáveis de ambiente válidas para os testes
  const validEnvVars = {
    NODE_ENV: 'test',
    POSTGRESQL_SERVER: 'localhost',
    POSTGRESQL_PORT: '5432',
    POSTGRESQL_DATABASE: 'testdb',
    POSTGRESQL_USER: 'testuser',
    POSTGRESQL_PASSWORD: 'testpass',
  };

  beforeAll(() => {
    // Define as variáveis de ambiente para os testes
    Object.assign(process.env, validEnvVars);
  });

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          validate: validateEnv,
          isGlobal: true,
        }),
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('deve ser definido', () => {
    expect(module).toBeDefined();
  });

  describe('Providers', () => {
    it('deve fornecer AppController', () => {
      expect(appController).toBeDefined();
      expect(appController).toBeInstanceOf(AppController);
    });

    it('deve fornecer AppService', () => {
      expect(appService).toBeDefined();
      expect(appService).toBeInstanceOf(AppService);
    });

    it('deve fornecer ConfigService', () => {
      expect(configService).toBeDefined();
      expect(configService).toBeInstanceOf(ConfigService);
    });
  });

  describe('ConfigModule Integration', () => {
    it('deve carregar ConfigModule como global', () => {
      // O ConfigService deve estar disponível globalmente
      expect(configService).toBeDefined();
    });

    it('deve usar a função de validação personalizada', () => {
      // Verifica se as variáveis de ambiente foram validadas
      expect(configService.get('NODE_ENV')).toBe('test');
      expect(configService.get('POSTGRESQL_SERVER')).toBe('localhost');
      expect(configService.get('POSTGRESQL_PORT')).toBe(5432); // Number após validação
    });

    it('deve ter acesso a todas as variáveis de ambiente configuradas', () => {
      const nodeEnv = configService.get('NODE_ENV');
      const dbServer = configService.get('POSTGRESQL_SERVER');
      const dbPort = configService.get('POSTGRESQL_PORT');
      const dbName = configService.get('POSTGRESQL_DATABASE');
      const dbUser = configService.get('POSTGRESQL_USER');
      const dbPassword = configService.get('POSTGRESQL_PASSWORD');

      expect(nodeEnv).toBe('test');
      expect(dbServer).toBe('localhost');
      expect(dbPort).toBe(5432); // Number após validação
      expect(dbName).toBe('testdb');
      expect(dbUser).toBe('testuser');
      expect(dbPassword).toBe('testpass');
    });

    it('deve retornar undefined para variáveis não definidas', () => {
      const undefinedVar = configService.get('UNDEFINED_VARIABLE');
      expect(undefinedVar).toBeUndefined();
    });

    it('deve permitir valores padrão para variáveis não definidas', () => {
      const defaultValue = configService.get('UNDEFINED_VARIABLE', 'default-value');
      expect(defaultValue).toBe('default-value');
    });
  });

  describe('Integração entre Controllers e Services', () => {
    it('deve permitir que AppController use AppService', () => {
      const result = appController.getHello();
      expect(result).toBe('Hello World!');
    });

    it('deve injetar ConfigService no AppService', () => {
      // AppService deve ter acesso ao ConfigService
      expect(appService).toBeDefined();
      // Verifica se a injeção de dependência funcionou
      const serviceConfigService = (appService as any).configService;
      expect(serviceConfigService).toBeDefined();
      expect(serviceConfigService).toBeInstanceOf(ConfigService);
    });
  });
});

describe('AppModule Configuration Edge Cases', () => {
  const originalEnv = process.env;
  
  afterEach(() => {
    process.env = originalEnv;
  });

  it('deve falhar ao inicializar com configuração inválida', () => {
    // Mock de process.exit para não terminar os testes
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
    
    // Mock console.error para silenciar logs
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

    // Usa a função validateEnv diretamente com configuração inválida
    try {
      validateEnv({});
      // Se chegou até aqui, o teste falhou
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe('process.exit called');
      expect(mockExit).toHaveBeenCalledWith(1);
      expect(mockConsoleError).toHaveBeenCalled();
    } finally {
      mockExit.mockRestore();
      mockConsoleError.mockRestore();
    }
  });
});
