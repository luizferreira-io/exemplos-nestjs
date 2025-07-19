import {
  Controller,
  Get,
  Post,
  Patch,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { RecadosService } from './recados.service';
import { RecadoEntity } from './entities/recado.entity';
import { RecadoCreateDto } from './dtos/recadoCreate.dto';
import { RecadoUpdateDto } from './dtos/recadoUpdate.dto';
import { RecadoUpdateFullDto } from './dtos/recadoUpdateFull.dto';
import { RecadoPaginatedResponseDto } from './dtos/recadoPaginated.dto';
import { JoiValidationPipe } from './pipes/joiValidation.pipe';
import { RecadoCreateSchema } from './schemas/recadoCreate.schema';
import { RecadoUpdateSchema } from './schemas/recadoUpdate.schema';
import { RecadoUpdateFullSchema } from './schemas/recadoUpdateFull.schema';
import { PaginatedResponse } from './interfaces/pagination.interface';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('recados')
@ApiBearerAuth()
@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosService: RecadosService) {}

  @ApiOperation({ summary: 'Listar todos os recados com paginação' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Número de registros para pular' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número máximo de registros a retornar' })
  @ApiResponse({
    status: 200,
    description: 'Lista de recados retornada com sucesso',
    type: RecadoPaginatedResponseDto,
  })
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): PaginatedResponse<RecadoEntity> {
    return this.recadosService.findAll({ offset, limit });
  }

  @ApiOperation({ summary: 'Buscar um recado pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do recado' })
  @ApiResponse({
    status: 200,
    description: 'Recado encontrado com sucesso',
    type: RecadoEntity,
  })
  @ApiResponse({ status: 404, description: 'Recado não encontrado' })
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): RecadoEntity {
    return this.recadosService.findOne(id);
  }

  @ApiOperation({ summary: 'Criar um novo recado' })
  @ApiResponse({
    status: 201,
    description: 'Recado criado com sucesso',
    type: RecadoEntity,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @Post()
  create(@Body(new JoiValidationPipe(RecadoCreateSchema)) dto: RecadoCreateDto): RecadoEntity {
    return this.recadosService.create(dto);
  }

  @ApiOperation({ summary: 'Atualizar parcialmente um recado' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do recado' })
  @ApiResponse({
    status: 200,
    description: 'Recado atualizado com sucesso',
    type: RecadoEntity,
  })
  @ApiResponse({ status: 404, description: 'Recado não encontrado' })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body(new JoiValidationPipe(RecadoUpdateSchema)) dto: RecadoUpdateDto): RecadoEntity {
    return this.recadosService.update(id, dto);
  }

  @ApiOperation({ summary: 'Marcar recado como lido' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do recado' })
  @ApiResponse({
    status: 200,
    description: 'Recado marcado como lido',
    type: RecadoEntity,
  })
  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number): RecadoEntity {
    return this.recadosService.markAsRead(id);
  }

  @ApiOperation({ summary: 'Substituir completamente um recado' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do recado' })
  @ApiResponse({
    status: 200,
    description: 'Recado substituído com sucesso',
    type: RecadoEntity,
  })
  @ApiResponse({ status: 404, description: 'Recado não encontrado' })
  @Put(':id')
  updateFull(
    @Param('id', ParseIntPipe) id: number,
    @Body(new JoiValidationPipe(RecadoUpdateFullSchema)) dto: RecadoUpdateFullDto,
  ): RecadoEntity {
    return this.recadosService.updateFull(id, dto);
  }

  @ApiOperation({ summary: 'Deletar um recado' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do recado' })
  @ApiResponse({ status: 204, description: 'Recado deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Recado não encontrado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): void {
    this.recadosService.remove(id);
  }
}
