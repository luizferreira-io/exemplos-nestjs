import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply same configuration as main.ts
    app.setGlobalPrefix('api/v1');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/v1/auth/login (POST)', () => {
    it('should login with valid credentials (from env)', async () => {
      const loginData = {
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123',
      };

      const response = await request(app.getHttpServer()).post('/api/v1/auth/login').send(loginData).expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('username');
      expect(response.body.user.username).toBe(loginData.username);

      // Guardar o token para testes futuros
      jwtToken = response.body.access_token;
    });

    it('should login with default credentials', async () => {
      const loginData = {
        username: 'admin',
        password: 'admin123',
      };

      const response = await request(app.getHttpServer()).post('/api/v1/auth/login').send(loginData).expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id', '1');
      expect(response.body.user).toHaveProperty('username', 'admin');
      expect(typeof response.body.access_token).toBe('string');
      expect(response.body.access_token.length).toBeGreaterThan(0);
    });

    it('should return 401 for invalid username', async () => {
      const loginData = {
        username: 'wronguser',
        password: 'admin123',
      };

      const response = await request(app.getHttpServer()).post('/api/v1/auth/login').send(loginData).expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Credenciais inválidas');
    });

    it('should return 401 for invalid password', async () => {
      const loginData = {
        username: 'admin',
        password: 'wrongpassword',
      };

      const response = await request(app.getHttpServer()).post('/api/v1/auth/login').send(loginData).expect(401);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Credenciais inválidas');
    });

    it('should return 400 for missing username', async () => {
      const loginData = {
        password: 'admin123',
      };

      await request(app.getHttpServer()).post('/api/v1/auth/login').send(loginData).expect(400);
    });

    it('should return 400 for missing password', async () => {
      const loginData = {
        username: 'admin',
      };

      await request(app.getHttpServer()).post('/api/v1/auth/login').send(loginData).expect(400);
    });

    it('should return 400 for empty username', async () => {
      const loginData = {
        username: '',
        password: 'admin123',
      };

      await request(app.getHttpServer()).post('/api/v1/auth/login').send(loginData).expect(400);
    });

    it('should return 400 for empty password', async () => {
      const loginData = {
        username: 'admin',
        password: '',
      };

      await request(app.getHttpServer()).post('/api/v1/auth/login').send(loginData).expect(400);
    });

    it('should validate JWT token structure', async () => {
      const loginData = {
        username: 'admin',
        password: 'admin123',
      };

      const response = await request(app.getHttpServer()).post('/api/v1/auth/login').send(loginData).expect(200);

      const token = response.body.access_token;

      // Verificar se o token JWT tem a estrutura correta (header.payload.signature)
      const tokenParts = token.split('.');
      expect(tokenParts).toHaveLength(3);

      // Verificar se cada parte é base64
      tokenParts.forEach((part) => {
        expect(part).toMatch(/^[A-Za-z0-9_-]+$/);
      });
    });
  });

  describe('Protected Routes', () => {
    beforeAll(async () => {
      // Garantir que temos um token válido para os testes
      const loginData = {
        username: 'admin',
        password: 'admin123',
      };

      const response = await request(app.getHttpServer()).post('/api/v1/auth/login').send(loginData).expect(200);

      jwtToken = response.body.access_token;
    });

    it('should access protected route with valid JWT token', async () => {
      const newRecado = {
        texto: 'Recado com autenticação',
        de: 'Admin',
        para: 'Usuario',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/recados')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(newRecado)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.texto).toBe(newRecado.texto);
    });

    it('should deny access to protected route without token', async () => {
      const newRecado = {
        texto: 'Recado sem token',
        de: 'Usuario',
        para: 'Admin',
      };

      await request(app.getHttpServer()).post('/api/v1/recados').send(newRecado).expect(401);
    });

    it('should deny access to protected route with invalid token', async () => {
      const newRecado = {
        texto: 'Recado com token inválido',
        de: 'Usuario',
        para: 'Admin',
      };

      await request(app.getHttpServer()).post('/api/v1/recados').set('Authorization', 'Bearer invalid-token').send(newRecado).expect(401);
    });

    it('should deny access to protected route with malformed token', async () => {
      const newRecado = {
        texto: 'Recado com token malformado',
        de: 'Usuario',
        para: 'Admin',
      };

      await request(app.getHttpServer()).post('/api/v1/recados').set('Authorization', 'Bearer malformed.token').send(newRecado).expect(401);
    });

    it('should deny access to protected route with expired token', async () => {
      // Token JWT com payload expirado (exp no passado)
      const expiredToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJhZG1pbiIsImV4cCI6MTY3MDAwMDAwMH0.invalidSignature';

      const newRecado = {
        texto: 'Recado com token expirado',
        de: 'Usuario',
        para: 'Admin',
      };

      await request(app.getHttpServer()).post('/api/v1/recados').set('Authorization', `Bearer ${expiredToken}`).send(newRecado).expect(401);
    });
  });

  describe('Public Routes', () => {
    it('should access health endpoint without authentication', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('status', 'ok');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('uptime');
          expect(res.body).toHaveProperty('memory');
        });
    });

    it('should access GET /api/v1/recados without authentication (public route)', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/recados')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('offset');
          expect(res.body).toHaveProperty('limit');
          expect(Array.isArray(res.body.data)).toBe(true);
        });
    });

    it('should access GET /api/v1/recados/:id without authentication (public route)', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/recados/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
        });
    });
  });

  describe('JWT Token Validation', () => {
    it('should validate token payload contains correct user information', async () => {
      const loginData = {
        username: 'admin',
        password: 'admin123',
      };

      const loginResponse = await request(app.getHttpServer()).post('/api/v1/auth/login').send(loginData).expect(200);

      const token = loginResponse.body.access_token;

      // Decodificar o payload do JWT (sem verificar a assinatura)
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(Buffer.from(payloadBase64, 'base64').toString());

      expect(payload).toHaveProperty('sub', '1');
      expect(payload).toHaveProperty('username', 'admin');
      expect(payload).toHaveProperty('iat');
      expect(payload).toHaveProperty('exp');

      // Verificar se o token não está expirado
      const currentTime = Math.floor(Date.now() / 1000);
      expect(payload.exp).toBeGreaterThan(currentTime);
    });

    it('should maintain token validity across multiple requests', async () => {
      const loginData = {
        username: 'admin',
        password: 'admin123',
      };

      const loginResponse = await request(app.getHttpServer()).post('/api/v1/auth/login').send(loginData).expect(200);

      const token = loginResponse.body.access_token;

      // Fazer múltiplas requisições com o mesmo token
      for (let i = 0; i < 3; i++) {
        await request(app.getHttpServer()).get('/api/v1/recados').set('Authorization', `Bearer ${token}`).expect(200);
      }
    });
  });
});
