import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RecadosService } from './recados.service';
import { RecadoCreateDto } from './dtos/recadoCreate.dto';
import { RecadoUpdateDto } from './dtos/recadoUpdate.dto';
import { RecadoUpdateFullDto } from './dtos/recadoUpdateFull.dto';
import { PaginatedResponse } from './interfaces/pagination.interface';

describe('RecadosService', () => {
  let service: RecadosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecadosService],
    }).compile();

    service = module.get<RecadosService>(RecadosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated response with default parameters', () => {
      const result = service.findAll();
      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.total).toBeDefined();
      expect(result.offset).toBe(0);
      expect(result.limit).toBe(10);
      expect(result.data.length).toBeGreaterThan(0);
    });

    it('should return paginated recados when offset and limit are provided', () => {
      // Primeiro, vamos criar alguns recados para testar a paginação
      const createDto: RecadoCreateDto = {
        texto: 'Recado de teste',
        de: 'João',
        para: 'Maria',
      };

      service.create(createDto);
      service.create({ ...createDto, texto: 'Segundo recado' });
      service.create({ ...createDto, texto: 'Terceiro recado' });

      const result = service.findAll({ offset: 1, limit: 2 });
      expect(result).toBeDefined();
      expect(result.data.length).toBe(2);
      expect(result.offset).toBe(1);
      expect(result.limit).toBe(2);
    });

    it('should handle pagination correctly with large offset', () => {
      const result = service.findAll({ offset: 1000, limit: 5 });
      expect(result.data.length).toBe(0);
      expect(result.offset).toBe(1000);
      expect(result.limit).toBe(5);
    });
  });

  describe('findOne', () => {
    it('should return a recado when valid id is provided', () => {
      const result = service.findOne(1);
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.texto).toBe('Este é um recado de teste');
    });

    it('should throw NotFoundException when invalid id is provided', () => {
      expect(() => service.findOne(999)).toThrow(NotFoundException);
      expect(() => service.findOne(999)).toThrow('Recado 999 não encontrado');
    });
  });

  describe('create', () => {
    it('should create a new recado successfully and return it', () => {
      const createDto: RecadoCreateDto = {
        texto: 'Novo recado de teste',
        de: 'Ana',
        para: 'Carlos',
      };

      const initialCount = service.findAll().total;
      const newRecado = service.create(createDto);
      const finalCount = service.findAll().total;

      expect(finalCount).toBe(initialCount + 1);
      expect(newRecado).toBeDefined();
      expect(newRecado.texto).toBe(createDto.texto);
      expect(newRecado.de).toBe(createDto.de);
      expect(newRecado.para).toBe(createDto.para);
      expect(newRecado.lido).toBe(false);
      expect(newRecado.data).toBeInstanceOf(Date);
      expect(newRecado.id).toBeDefined();
    });
  });

  describe('update', () => {
    it('should update an existing recado successfully and return it', () => {
      const updateDto: RecadoUpdateDto = {
        texto: 'Texto atualizado',
        de: 'Joana',
        para: 'João',
      };

      const updatedRecado = service.update(1, updateDto);

      expect(updatedRecado).toBeDefined();
      expect(updatedRecado.texto).toBe(updateDto.texto);
      expect(updatedRecado.de).toBe(updateDto.de);
      expect(updatedRecado.para).toBe(updateDto.para);
      expect(updatedRecado.lido).toBe(false);
      expect(updatedRecado.data).toBeInstanceOf(Date);
    });

    it('should throw NotFoundException when trying to update non-existent recado', () => {
      const updateDto: RecadoUpdateDto = {
        texto: 'Texto atualizado',
        de: 'Joana',
        para: 'João',
      };

      expect(() => service.update(999, updateDto)).toThrow(NotFoundException);
      expect(() => service.update(999, updateDto)).toThrow('Recado 999 não encontrado');
    });
  });

  describe('updateFull', () => {
    it('should fully update an existing recado successfully and return it', () => {
      const updateFullDto: RecadoUpdateFullDto = {
        texto: 'Texto completamente novo',
        de: 'Novo remetente',
        para: 'Novo destinatário',
      };

      const updatedRecado = service.updateFull(1, updateFullDto);

      expect(updatedRecado).toBeDefined();
      expect(updatedRecado.texto).toBe(updateFullDto.texto);
      expect(updatedRecado.de).toBe(updateFullDto.de);
      expect(updatedRecado.para).toBe(updateFullDto.para);
      expect(updatedRecado.lido).toBe(false);
      expect(updatedRecado.data).toBeInstanceOf(Date);
    });

    it('should throw NotFoundException when trying to fully update non-existent recado', () => {
      const updateFullDto: RecadoUpdateFullDto = {
        texto: 'Texto completamente novo',
        de: 'Novo remetente',
        para: 'Novo destinatário',
      };

      expect(() => service.updateFull(999, updateFullDto)).toThrow(NotFoundException);
      expect(() => service.updateFull(999, updateFullDto)).toThrow('Recado 999 não encontrado');
    });
  });

  describe('markAsRead', () => {
    it('should mark a recado as read', () => {
      const readRecado = service.markAsRead(1);

      expect(readRecado).toBeDefined();
      expect(readRecado.id).toBe(1);
      expect(readRecado.lido).toBe(true);
    });

    it('should throw NotFoundException when trying to mark non-existent recado as read', () => {
      expect(() => service.markAsRead(999)).toThrow(NotFoundException);
      expect(() => service.markAsRead(999)).toThrow('Recado 999 não encontrado');
    });
  });

  describe('remove', () => {
    it('should remove an existing recado successfully', () => {
      // Criar um recado para remover
      const createDto: RecadoCreateDto = {
        texto: 'Recado para remover',
        de: 'Teste',
        para: 'Teste',
      };

      const newRecado = service.create(createDto);
      const initialCount = service.findAll().total;

      service.remove(newRecado.id);
      const finalCount = service.findAll().total;

      expect(finalCount).toBe(initialCount - 1);
      expect(() => service.findOne(newRecado.id)).toThrow(NotFoundException);
    });

    it('should throw NotFoundException when trying to remove non-existent recado', () => {
      expect(() => service.remove(999)).toThrow(NotFoundException);
      expect(() => service.remove(999)).toThrow('Recado 999 não encontrado');
    });
  });
});
