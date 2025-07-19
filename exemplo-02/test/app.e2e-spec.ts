import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('RecadosController (e2e)', () => {
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

    // Fazer login para obter o token JWT
    const loginData = {
      username: 'admin',
      password: 'admin123',
    };

    const loginResponse = await request(app.getHttpServer()).post('/api/v1/auth/login').send(loginData).expect(200);

    jwtToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/v1/recados (GET)', () => {
    it('should return all recados', () => {
      return request(app.getHttpServer())
        .get('/api/v1/recados')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('offset');
          expect(res.body).toHaveProperty('limit');
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data.length).toBeGreaterThan(0);
        });
    });

    it('should return paginated recados', () => {
      return request(app.getHttpServer())
        .get('/api/v1/recados?offset=0&limit=1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('total');
          expect(res.body).toHaveProperty('offset');
          expect(res.body).toHaveProperty('limit');
          expect(Array.isArray(res.body.data)).toBe(true);
          expect(res.body.data.length).toBeLessThanOrEqual(1);
        });
    });
  });

  describe('/api/v1/recados/:id (GET)', () => {
    it('should return a specific recado', () => {
      return request(app.getHttpServer())
        .get('/api/v1/recados/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', 1);
          expect(res.body).toHaveProperty('texto');
          expect(res.body).toHaveProperty('de');
          expect(res.body).toHaveProperty('para');
          expect(res.body).toHaveProperty('lido');
          expect(res.body).toHaveProperty('data');
        });
    });

    it('should return 404 for non-existent recado', () => {
      return request(app.getHttpServer()).get('/api/v1/recados/999').expect(404);
    });
  });

  describe('/api/v1/recados (POST)', () => {
    it('should create a new recado with valid data and authentication', () => {
      const newRecado = {
        texto: 'Novo recado de teste',
        de: 'Teste',
        para: 'Usuario',
      };

      return request(app.getHttpServer()).post('/api/v1/recados').set('Authorization', `Bearer ${jwtToken}`).send(newRecado).expect(201);
    });

    it('should return 401 when creating recado without authentication', () => {
      const newRecado = {
        texto: 'Novo recado sem auth',
        de: 'Teste',
        para: 'Usuario',
      };

      return request(app.getHttpServer()).post('/api/v1/recados').send(newRecado).expect(401);
    });

    it('should return 400 for invalid data (missing required fields)', () => {
      const invalidRecado = {
        texto: 'Apenas texto',
        // missing 'de' and 'para'
      };

      return request(app.getHttpServer())
        .post('/api/v1/recados')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(invalidRecado)
        .expect(400);
    });

    it('should return 400 for invalid data (empty fields)', () => {
      const invalidRecado = {
        texto: '',
        de: '',
        para: '',
      };

      return request(app.getHttpServer())
        .post('/api/v1/recados')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(invalidRecado)
        .expect(400);
    });

    it('should return 400 for invalid data (fields too short)', () => {
      const invalidRecado = {
        texto: 'a',
        de: 'b',
        para: 'c',
      };

      return request(app.getHttpServer())
        .post('/api/v1/recados')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(invalidRecado)
        .expect(400);
    });
  });

  describe('/api/v1/recados/:id (PATCH)', () => {
    it('should update a recado with partial data and authentication', () => {
      const updateData = {
        texto: 'Texto atualizado via PATCH',
        de: 'Novo remetente',
        para: 'Novo destinatário',
      };

      return request(app.getHttpServer())
        .patch('/api/v1/recados/1')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updateData)
        .expect(200);
    });

    it('should return 401 when updating recado without authentication', () => {
      const updateData = {
        texto: 'Texto sem auth',
        de: 'Remetente',
        para: 'Destinatário',
      };

      return request(app.getHttpServer()).patch('/api/v1/recados/1').send(updateData).expect(401);
    });

    it('should return 404 when trying to update non-existent recado', () => {
      const updateData = {
        texto: 'Texto atualizado',
        de: 'Remetente',
        para: 'Destinatário',
      };

      return request(app.getHttpServer())
        .patch('/api/v1/recados/999')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updateData)
        .expect(404);
    });
  });

  describe('/api/v1/recados/:id (PUT)', () => {
    it('should fully update a recado with authentication', () => {
      const updateData = {
        texto: 'Texto completamente atualizado',
        de: 'Novo remetente completo',
        para: 'Novo destinatário completo',
      };

      return request(app.getHttpServer()).put('/api/v1/recados/1').set('Authorization', `Bearer ${jwtToken}`).send(updateData).expect(200);
    });

    it('should return 401 when fully updating recado without authentication', () => {
      const updateData = {
        texto: 'Texto sem auth',
        de: 'Remetente',
        para: 'Destinatário',
      };

      return request(app.getHttpServer()).put('/api/v1/recados/1').send(updateData).expect(401);
    });

    it('should return 400 for incomplete data in PUT request', () => {
      const incompleteData = {
        texto: 'Apenas texto',
        // missing 'de' and 'para'
      };

      return request(app.getHttpServer())
        .put('/api/v1/recados/1')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(incompleteData)
        .expect(400);
    });

    it('should return 404 when trying to fully update non-existent recado', () => {
      const updateData = {
        texto: 'Texto atualizado',
        de: 'Remetente',
        para: 'Destinatário',
      };

      return request(app.getHttpServer())
        .put('/api/v1/recados/999')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updateData)
        .expect(404);
    });
  });

  describe('/api/v1/recados/:id (DELETE)', () => {
    it('should delete an existing recado with authentication', async () => {
      // Primeiro, criar um recado para deletar
      const newRecado = {
        texto: 'Recado para deletar',
        de: 'Teste',
        para: 'Delete',
      };

      await request(app.getHttpServer()).post('/api/v1/recados').set('Authorization', `Bearer ${jwtToken}`).send(newRecado).expect(201);

      // Buscar todos os recados para encontrar o ID do recado criado
      const response = await request(app.getHttpServer()).get('/api/v1/recados').expect(200);

      const recados = response.body.data;
      const recadoToDelete = recados[recados.length - 1];

      // Deletar o recado com autenticação
      await request(app.getHttpServer())
        .delete(`/api/v1/recados/${recadoToDelete.id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(204);

      // Verificar se o recado foi deletado
      await request(app.getHttpServer()).get(`/api/v1/recados/${recadoToDelete.id}`).expect(404);
    });

    it('should return 401 when trying to delete recado without authentication', () => {
      return request(app.getHttpServer()).delete('/api/v1/recados/1').expect(401);
    });

    it('should return 404 when trying to delete non-existent recado', () => {
      return request(app.getHttpServer()).delete('/api/v1/recados/999').set('Authorization', `Bearer ${jwtToken}`).expect(404);
    });
  });
});
