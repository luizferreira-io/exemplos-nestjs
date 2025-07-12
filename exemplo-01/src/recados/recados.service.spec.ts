import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RecadosService } from './recados.service';
import { RecadoCreateDto } from './dtos/recadoCreate.dto';
import { RecadoUpdateDto } from './dtos/recadoUpdate.dto';
import { RecadoUpdateFullDto } from './dtos/recadoUpdateFull.dto';

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
    it('should return all recados when no pagination is provided', () => {
      const result = service.findAll(null as any, null as any);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
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

      const result = service.findAll(1, 2);
      expect(result).toBeDefined();
      expect(result.length).toBe(2);
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
    it('should create a new recado successfully', () => {
      const createDto: RecadoCreateDto = {
        texto: 'Novo recado de teste',
        de: 'Ana',
        para: 'Carlos',
      };

      const initialCount = service.findAll(null as any, null as any).length;
      service.create(createDto);
      const finalCount = service.findAll(null as any, null as any).length;

      expect(finalCount).toBe(initialCount + 1);

      // Verificar se o recado foi criado corretamente
      const allRecados = service.findAll(null as any, null as any);
      const newRecado = allRecados[allRecados.length - 1];

      expect(newRecado.texto).toBe(createDto.texto);
      expect(newRecado.de).toBe(createDto.de);
      expect(newRecado.para).toBe(createDto.para);
      expect(newRecado.lido).toBe(false);
      expect(newRecado.data).toBeInstanceOf(Date);
    });
  });

  describe('update', () => {
    it('should update an existing recado successfully', () => {
      const updateDto: RecadoUpdateDto = {
        texto: 'Texto atualizado',
        de: 'Joana',
        para: 'João',
      };

      service.update(1, updateDto);
      const updatedRecado = service.findOne(1);

      expect(updatedRecado.texto).toBe(updateDto.texto);
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
    it('should fully update an existing recado successfully', () => {
      const updateFullDto: RecadoUpdateFullDto = {
        texto: 'Texto completamente novo',
        de: 'Novo remetente',
        para: 'Novo destinatário',
      };

      service.updateFull(1, updateFullDto);
      const updatedRecado = service.findOne(1);

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

  describe('remove', () => {
    it('should remove an existing recado successfully', () => {
      // Criar um recado para remover
      const createDto: RecadoCreateDto = {
        texto: 'Recado para remover',
        de: 'Teste',
        para: 'Teste',
      };

      service.create(createDto);
      const allRecados = service.findAll(null as any, null as any);
      const recadoToRemove = allRecados[allRecados.length - 1];
      const initialCount = allRecados.length;

      service.remove(recadoToRemove.id);
      const finalCount = service.findAll(null as any, null as any).length;

      expect(finalCount).toBe(initialCount - 1);
      expect(() => service.findOne(recadoToRemove.id)).toThrow(NotFoundException);
    });

    it('should throw NotFoundException when trying to remove non-existent recado', () => {
      expect(() => service.remove(999)).toThrow(NotFoundException);
      expect(() => service.remove(999)).toThrow('Recado 999 não encontrado');
    });
  });
});
