import { ApiProperty } from '@nestjs/swagger';
import { RecadoEntity } from '../entities/recado.entity';

export class RecadoPaginatedResponseDto {
  @ApiProperty({
    description: 'Lista de recados encontrados',
    type: [RecadoEntity],
    isArray: true,
  })
  data: RecadoEntity[];

  @ApiProperty({
    description: 'Número total de recados no sistema',
    example: 15,
    type: 'number',
  })
  total: number;

  @ApiProperty({
    description: 'Número de recados pulados (offset)',
    example: 0,
    type: 'number',
  })
  offset: number;

  @ApiProperty({
    description: 'Número máximo de recados por página',
    example: 10,
    type: 'number',
  })
  limit: number;
}
