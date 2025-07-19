import { Injectable, NotFoundException } from '@nestjs/common';
import { RecadoEntity } from './entities/recado.entity';
import { RecadoCreateDto } from './dtos/recadoCreate.dto';
import { RecadoUpdateDto } from './dtos/recadoUpdate.dto';
import { RecadoUpdateFullDto } from './dtos/recadoUpdateFull.dto';
import { PaginationParams, PaginatedResponse } from './interfaces/pagination.interface';

@Injectable()
export class RecadosService {
  private lastId = 1;
  private recados: RecadoEntity[] = [
    {
      id: 1,
      texto: 'Este é um recado de teste',
      de: 'Joana',
      para: 'João',
      lido: false,
      data: new Date(),
    },
  ];

  findAll(params?: PaginationParams): PaginatedResponse<RecadoEntity> {
    const { offset = 0, limit = 10 } = params || {};
    const total = this.recados.length;
    const data = this.recados.slice(offset, offset + limit);

    return {
      data,
      total,
      offset,
      limit,
    };
  }

  findOne(id: number): RecadoEntity {
    const recado = this.recados.find((item) => item.id === id);
    if (!recado) {
      //throw new HttpException(`Recado ${id} não encontrado`, HttpStatus.NOT_FOUND);
      throw new NotFoundException(`Recado ${id} não encontrado`);
    }

    return recado;
  }

  create(dto: RecadoCreateDto): RecadoEntity {
    this.lastId++;
    const newRecado: RecadoEntity = {
      id: this.lastId,
      lido: false,
      data: new Date(),
      ...dto,
    };
    this.recados.push(newRecado);
    return newRecado;
  }

  update(id: number, dto: RecadoUpdateDto): RecadoEntity {
    const index = this.recados.findIndex((item) => item.id === id);
    if (index < 0) throw new NotFoundException(`Recado ${id} não encontrado`);

    this.recados[index] = {
      ...this.recados[index],
      ...dto,
      data: new Date(),
      lido: false,
    };

    return this.recados[index];
  }

  updateFull(id: number, dto: RecadoUpdateFullDto): RecadoEntity {
    const index = this.recados.findIndex((item) => item.id === id);
    if (index < 0) throw new NotFoundException(`Recado ${id} não encontrado`);

    this.recados[index] = {
      id: id,
      lido: false,
      data: new Date(),
      ...dto,
    };

    return this.recados[index];
  }

  remove(id: number): void {
    const index = this.recados.findIndex((item) => item.id === id);
    if (index < 0) throw new NotFoundException(`Recado ${id} não encontrado`);

    this.recados.splice(index, 1);
  }

  markAsRead(id: number): RecadoEntity {
    const recado = this.findOne(id);
    const index = this.recados.findIndex((item) => item.id === id);
    this.recados[index].lido = true;
    return this.recados[index];
  }
}
