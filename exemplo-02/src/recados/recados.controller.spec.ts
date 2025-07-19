import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';
import { RecadoCreateDto } from './dtos/recadoCreate.dto';
import { RecadoUpdateDto } from './dtos/recadoUpdate.dto';
import { RecadoUpdateFullDto } from './dtos/recadoUpdateFull.dto';
import { RecadoEntity } from './entities/recado.entity';
import { PaginatedResponse } from './interfaces/pagination.interface';

describe('RecadosController', () => {
  let controller: RecadosController;
  let service: RecadosService;

  const mockRecadosService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateFull: jest.fn(),
    remove: jest.fn(),
    markAsRead: jest.fn(),
  };

  const mockRecado: RecadoEntity = {
    id: 1,
    texto: 'Recado de teste',
    de: 'João',
    para: 'Maria',
    lido: false,
    data: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecadosController],
      providers: [
        {
          provide: RecadosService,
          useValue: mockRecadosService,
        },
      ],
    }).compile();

    controller = module.get<RecadosController>(RecadosController);
    service = module.get<RecadosService>(RecadosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a paginated response', () => {
      const mockPaginatedResponse: PaginatedResponse<RecadoEntity> = {
        data: [mockRecado],
        total: 1,
        offset: 0,
        limit: 10,
      };
      mockRecadosService.findAll.mockReturnValue(mockPaginatedResponse);

      const result = controller.findAll(0, 10);

      expect(result).toBe(mockPaginatedResponse);
      expect(service.findAll).toHaveBeenCalledWith({ offset: 0, limit: 10 });
    });

    it('should call service with correct parameters', () => {
      const offset = 5;
      const limit = 15;
      const mockResponse: PaginatedResponse<RecadoEntity> = {
        data: [],
        total: 0,
        offset: offset,
        limit: limit,
      };
      mockRecadosService.findAll.mockReturnValue(mockResponse);

      controller.findAll(offset, limit);

      expect(service.findAll).toHaveBeenCalledWith({ offset, limit });
    });
  });

  describe('findOne', () => {
    it('should return a single recado', () => {
      mockRecadosService.findOne.mockReturnValue(mockRecado);

      const result = controller.findOne(1);

      expect(result).toBe(mockRecado);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when service throws it', () => {
      mockRecadosService.findOne.mockImplementation(() => {
        throw new NotFoundException('Recado 999 não encontrado');
      });

      expect(() => controller.findOne(999)).toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('create', () => {
    it('should create a new recado and return it', () => {
      const createDto: RecadoCreateDto = {
        texto: 'Novo recado',
        de: 'Ana',
        para: 'Carlos',
      };

      const createdRecado = { ...mockRecado, ...createDto };
      mockRecadosService.create.mockReturnValue(createdRecado);

      const result = controller.create(createDto);

      expect(result).toBe(createdRecado);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update an existing recado and return it', () => {
      const updateDto: RecadoUpdateDto = {
        texto: 'Recado atualizado',
        de: 'João',
        para: 'Maria',
      };

      const updatedRecado = { ...mockRecado, ...updateDto };
      mockRecadosService.update.mockReturnValue(updatedRecado);

      const result = controller.update(1, updateDto);

      expect(result).toBe(updatedRecado);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw NotFoundException when service throws it', () => {
      const updateDto: RecadoUpdateDto = {
        texto: 'Recado atualizado',
        de: 'João',
        para: 'Maria',
      };

      mockRecadosService.update.mockImplementation(() => {
        throw new NotFoundException('Recado 999 não encontrado');
      });

      expect(() => controller.update(999, updateDto)).toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(999, updateDto);
    });
  });

  describe('markAsRead', () => {
    it('should mark a recado as read', () => {
      const readRecado = { ...mockRecado, lido: true };
      mockRecadosService.markAsRead.mockReturnValue(readRecado);

      const result = controller.markAsRead(1);

      expect(result).toBe(readRecado);
      expect(service.markAsRead).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when service throws it', () => {
      mockRecadosService.markAsRead.mockImplementation(() => {
        throw new NotFoundException('Recado 999 não encontrado');
      });

      expect(() => controller.markAsRead(999)).toThrow(NotFoundException);
      expect(service.markAsRead).toHaveBeenCalledWith(999);
    });
  });

  describe('updateFull', () => {
    it('should fully update an existing recado and return it', () => {
      const updateFullDto: RecadoUpdateFullDto = {
        texto: 'Recado completamente atualizado',
        de: 'Pedro',
        para: 'Ana',
      };

      const updatedRecado = { ...mockRecado, ...updateFullDto };
      mockRecadosService.updateFull.mockReturnValue(updatedRecado);

      const result = controller.updateFull(1, updateFullDto);

      expect(result).toBe(updatedRecado);
      expect(service.updateFull).toHaveBeenCalledWith(1, updateFullDto);
    });

    it('should throw NotFoundException when service throws it', () => {
      const updateFullDto: RecadoUpdateFullDto = {
        texto: 'Recado completamente atualizado',
        de: 'Pedro',
        para: 'Ana',
      };

      mockRecadosService.updateFull.mockImplementation(() => {
        throw new NotFoundException('Recado 999 não encontrado');
      });

      expect(() => controller.updateFull(999, updateFullDto)).toThrow(NotFoundException);
      expect(service.updateFull).toHaveBeenCalledWith(999, updateFullDto);
    });
  });

  describe('remove', () => {
    it('should remove an existing recado', () => {
      controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when service throws it', () => {
      mockRecadosService.remove.mockImplementation(() => {
        throw new NotFoundException('Recado 999 não encontrado');
      });

      expect(() => controller.remove(999)).toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(999);
    });
  });
});
