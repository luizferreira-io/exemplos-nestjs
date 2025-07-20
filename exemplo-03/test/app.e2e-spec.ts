import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let configService: ConfigService;

  // Mock das variáveis de ambiente para os testes e2e
  const testEnvVars = {
    NODE_ENV: 'test',
    POSTGRESQL_SERVER: 'localhost',
    POSTGRESQL_PORT: '5432',
    POSTGRESQL_DATABASE: 'testdb',
    POSTGRESQL_USER: 'testuser',
    POSTGRESQL_PASSWORD: 'testpass',
  };

  beforeAll(() => {
    // Define as variáveis de ambiente para os testes
    Object.assign(process.env, testEnvVars);
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configService = app.get<ConfigService>(ConfigService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Endpoints', () => {
    it('/ (GET) - deve retornar Hello World', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Hello World!');
    });

    it('/ (GET) - deve retornar content-type text/html', () => {
      return request(app.getHttpServer())
        .get('/')
        .expect(200)
        .expect('Content-Type', /text\/html/);
    });

    it('/ (GET) - deve sempre retornar a mesma resposta', async () => {
      const response1 = await request(app.getHttpServer()).get('/');
      const response2 = await request(app.getHttpServer()).get('/');
      
      expect(response1.text).toBe(response2.text);
      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
    });
  });

  describe('Rotas não existentes', () => {
    it('/nonexistent (GET) - deve retornar 404', () => {
      return request(app.getHttpServer())
        .get('/nonexistent')
        .expect(404);
    });

    it('/api/something (GET) - deve retornar 404', () => {
      return request(app.getHttpServer())
        .get('/api/something')
        .expect(404);
    });
  });

  describe('Diferentes métodos HTTP', () => {
    it('/ (POST) - deve retornar 404 (método não permitido)', () => {
      return request(app.getHttpServer())
        .post('/')
        .expect(404);
    });

    it('/ (PUT) - deve retornar 404 (método não permitido)', () => {
      return request(app.getHttpServer())
        .put('/')
        .expect(404);
    });

    it('/ (DELETE) - deve retornar 404 (método não permitido)', () => {
      return request(app.getHttpServer())
        .delete('/')
        .expect(404);
    });

    it('/ (PATCH) - deve retornar 404 (método não permitido)', () => {
      return request(app.getHttpServer())
        .patch('/')
        .expect(404);
    });
  });

  describe('Configuração da aplicação', () => {
    it('deve ter ConfigService disponível', () => {
      expect(configService).toBeDefined();
      expect(configService).toBeInstanceOf(ConfigService);
    });

    it('deve ter acesso às variáveis de ambiente configuradas', () => {
      expect(configService.get('NODE_ENV')).toBe('test');
      expect(configService.get('POSTGRESQL_SERVER')).toBe('localhost');
      expect(configService.get('POSTGRESQL_PORT')).toBe(5432); // Number após validação
      expect(configService.get('POSTGRESQL_DATABASE')).toBe('testdb');
    });

    it('deve estar rodando no ambiente de teste', () => {
      expect(configService.get('NODE_ENV')).toBe('test');
    });
  });

  describe('Performance e Headers', () => {
    it('deve responder rapidamente (< 100ms)', async () => {
      const startTime = Date.now();
      
      await request(app.getHttpServer())
        .get('/')
        .expect(200);
      
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(responseTime).toBeLessThan(100);
    });

    it('deve incluir headers básicos', async () => {
      const response = await request(app.getHttpServer())
        .get('/')
        .expect(200);

      expect(response.headers).toHaveProperty('content-length');
      expect(response.headers).toHaveProperty('content-type');
    });
  });
});
