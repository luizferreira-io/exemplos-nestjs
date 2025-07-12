import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('RecadosController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/recados (GET)', () => {
    it('should return all recados', () => {
      return request(app.getHttpServer())
        .get('/recados')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });

    it('should return paginated recados', () => {
      return request(app.getHttpServer())
        .get('/recados?offset=0&limit=1')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeLessThanOrEqual(1);
        });
    });
  });

  describe('/recados/:id (GET)', () => {
    it('should return a specific recado', () => {
      return request(app.getHttpServer())
        .get('/recados/1')
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
      return request(app.getHttpServer()).get('/recados/999').expect(404);
    });
  });

  describe('/recados (POST)', () => {
    it('should create a new recado with valid data', () => {
      const newRecado = {
        texto: 'Novo recado de teste',
        de: 'Teste',
        para: 'Usuario',
      };

      return request(app.getHttpServer()).post('/recados').send(newRecado).expect(201);
    });

    it('should return 400 for invalid data (missing required fields)', () => {
      const invalidRecado = {
        texto: 'Apenas texto',
        // missing 'de' and 'para'
      };

      return request(app.getHttpServer()).post('/recados').send(invalidRecado).expect(400);
    });

    it('should return 400 for invalid data (empty fields)', () => {
      const invalidRecado = {
        texto: '',
        de: '',
        para: '',
      };

      return request(app.getHttpServer()).post('/recados').send(invalidRecado).expect(400);
    });

    it('should return 400 for invalid data (fields too short)', () => {
      const invalidRecado = {
        texto: 'a',
        de: 'b',
        para: 'c',
      };

      return request(app.getHttpServer()).post('/recados').send(invalidRecado).expect(400);
    });
  });

  describe('/recados/:id (PATCH)', () => {
    it('should update a recado with partial data', () => {
      const updateData = {
        texto: 'Texto atualizado via PATCH',
        de: 'Novo remetente',
        para: 'Novo destinatário',
      };

      return request(app.getHttpServer()).patch('/recados/1').send(updateData).expect(200);
    });

    it('should return 404 when trying to update non-existent recado', () => {
      const updateData = {
        texto: 'Texto atualizado',
        de: 'Remetente',
        para: 'Destinatário',
      };

      return request(app.getHttpServer()).patch('/recados/999').send(updateData).expect(404);
    });
  });

  describe('/recados/:id (PUT)', () => {
    it('should fully update a recado', () => {
      const updateData = {
        texto: 'Texto completamente atualizado',
        de: 'Novo remetente completo',
        para: 'Novo destinatário completo',
      };

      return request(app.getHttpServer()).put('/recados/1').send(updateData).expect(200);
    });

    it('should return 400 for incomplete data in PUT request', () => {
      const incompleteData = {
        texto: 'Apenas texto',
        // missing 'de' and 'para'
      };

      return request(app.getHttpServer()).put('/recados/1').send(incompleteData).expect(400);
    });

    it('should return 404 when trying to fully update non-existent recado', () => {
      const updateData = {
        texto: 'Texto atualizado',
        de: 'Remetente',
        para: 'Destinatário',
      };

      return request(app.getHttpServer()).put('/recados/999').send(updateData).expect(404);
    });
  });

  describe('/recados/:id (DELETE)', () => {
    it('should delete an existing recado', async () => {
      // Primeiro, criar um recado para deletar
      const newRecado = {
        texto: 'Recado para deletar',
        de: 'Teste',
        para: 'Delete',
      };

      await request(app.getHttpServer()).post('/recados').send(newRecado).expect(201);

      // Buscar todos os recados para encontrar o ID do recado criado
      const response = await request(app.getHttpServer()).get('/recados').expect(200);

      const recados = response.body;
      const recadoToDelete = recados[recados.length - 1];

      // Deletar o recado
      await request(app.getHttpServer()).delete(`/recados/${recadoToDelete.id}`).expect(200);

      // Verificar se o recado foi deletado
      await request(app.getHttpServer()).get(`/recados/${recadoToDelete.id}`).expect(404);
    });

    it('should return 404 when trying to delete non-existent recado', () => {
      return request(app.getHttpServer()).delete('/recados/999').expect(404);
    });
  });
});
