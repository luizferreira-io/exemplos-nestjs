import { Controller, Get, Post, Patch, Put, Delete, Param, Body, Query, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { RecadosService } from './recados.service';
import { RecadoEntity } from './entities/recado.entity';
import { RecadoCreateDto } from './dtos/recadoCreate.dto';
import { RecadoUpdateDto } from './dtos/recadoUpdate.dto';
import { RecadoUpdateFullDto } from './dtos/recadoUpdateFull.dto';
import { JoiValidationPipe } from './pipes/joiValidation.pipe';
import { RecadoCreateSchema } from './schemas/recadoCreate.schema';
import { RecadoUpdateSchema } from './schemas/recadoUpdate.schema';
import { RecadoUpdateFullSchema } from './schemas/recadoUpdateFull.schema';

@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Query('offset') offset: number, @Query('limit') limit: number): RecadoEntity[] {
    return this.recadosService.findAll(offset, limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): RecadoEntity {
    return this.recadosService.findOne(id);
  }

  @Post()
  create(@Body(new JoiValidationPipe(RecadoCreateSchema)) dto: RecadoCreateDto): void {
    this.recadosService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(new JoiValidationPipe(RecadoUpdateSchema)) dto: RecadoUpdateDto): void {
    this.recadosService.update(id, dto);
  }

  @Put(':id')
  updateFull(@Param('id', ParseIntPipe) id: number, @Body(new JoiValidationPipe(RecadoUpdateFullSchema)) dto: RecadoUpdateFullDto): void {
    this.recadosService.updateFull(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): void {
    this.recadosService.remove(id);
  }
}
