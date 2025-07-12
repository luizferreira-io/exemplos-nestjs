import { Injectable, NotFoundException } from '@nestjs/common';
import { RecadoEntity } from './entities/recado.entity';
import { RecadoCreateDto } from './dtos/recadoCreate.dto';
import { RecadoUpdateDto } from './dtos/recadoUpdate.dto';
import { RecadoUpdateFullDto } from './dtos/recadoUpdateFull.dto';

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

  findAll(offset: number, limit: number): RecadoEntity[] {
    if (offset && limit) {
      return this.recados.slice(offset, offset + limit);
    }
    return this.recados;
  }

  findOne(id: number): RecadoEntity {
    const recado = this.recados.find((item) => item.id === id);
    if (!recado) {
      //throw new HttpException(`Recado ${id} não encontrado`, HttpStatus.NOT_FOUND);
      throw new NotFoundException(`Recado ${id} não encontrado`);
    }

    return recado;
  }

  create(dto: RecadoCreateDto): void {
    this.lastId++;
    const newRecado: RecadoEntity = {
      id: this.lastId,
      lido: false,
      data: new Date(),
      ...dto,
    };
    this.recados.push(newRecado);
  }

  update(id: number, dto: RecadoUpdateDto): void {
    const index = this.recados.findIndex((item) => item.id === id);
    if (index < 0) throw new NotFoundException(`Recado ${id} não encontrado`);

    this.recados[index] = { ...this.recados[index], ...dto };
    this.recados[index].data = new Date();
    this.recados[index].lido = false;
  }

  updateFull(id: number, dto: RecadoUpdateFullDto): void {
    const index = this.recados.findIndex((item) => item.id === id);
    if (index < 0) throw new NotFoundException(`Recado ${id} não encontrado`);

    this.recados[index] = {
      id: id,
      lido: false,
      data: new Date(),
      ...dto,
    };
  }

  remove(id: number): void {
    const index = this.recados.findIndex((item) => item.id === id);
    if (index < 0) throw new NotFoundException(`Recado ${id} não encontrado`);

    this.recados.splice(index, 1);
  }
}
