import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;
  let configService: ConfigService;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('getHello', () => {
    it('deve retornar "Hello World!"', () => {
      const result = service.getHello();
      expect(result).toBe('Hello World!');
    });

    it('deve retornar sempre a mesma mensagem', () => {
      const result1 = service.getHello();
      const result2 = service.getHello();
      
      expect(result1).toBe(result2);
      expect(result1).toBe('Hello World!');
    });
  });

  describe('ConfigService integration', () => {
    it('deve ter acesso ao ConfigService', () => {
      expect(configService).toBeDefined();
    });

    it('pode usar o ConfigService para obter configurações', () => {
      const mockValue = 'test-value';
      (configService.get as jest.Mock).mockReturnValue(mockValue);

      const result = configService.get('TEST_KEY');
      
      expect(configService.get).toHaveBeenCalledWith('TEST_KEY');
      expect(result).toBe(mockValue);
    });

    it('pode obter configurações específicas do banco de dados', () => {
      const mockDbConfig = {
        server: 'localhost',
        port: 5432,
        database: 'testdb',
      };

      (configService.get as jest.Mock).mockImplementation((key: string) => {
        const configs: Record<string, any> = {
          'POSTGRESQL_SERVER': mockDbConfig.server,
          'POSTGRESQL_PORT': mockDbConfig.port,
          'POSTGRESQL_DATABASE': mockDbConfig.database,
        };
        return configs[key];
      });

      const server = configService.get('POSTGRESQL_SERVER');
      const port = configService.get('POSTGRESQL_PORT');
      const database = configService.get('POSTGRESQL_DATABASE');

      expect(server).toBe('localhost');
      expect(port).toBe(5432);
      expect(database).toBe('testdb');
    });
  });
});
