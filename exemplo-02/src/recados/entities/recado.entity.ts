import { ApiProperty } from '@nestjs/swagger';

export class RecadoEntity {
  @ApiProperty({
    description: 'ID único do recado',
    example: 1,
    type: 'number',
  })
  id: number;

  @ApiProperty({
    description: 'Texto do recado',
    example: 'Lembrete: reunião às 14h hoje!',
    type: 'string',
  })
  texto: string;

  @ApiProperty({
    description: 'Nome da pessoa que enviou o recado',
    example: 'João',
    type: 'string',
  })
  de: string;

  @ApiProperty({
    description: 'Nome da pessoa que receberá o recado',
    example: 'Maria',
    type: 'string',
  })
  para: string;

  @ApiProperty({
    description: 'Indica se o recado já foi lido',
    example: false,
    type: 'boolean',
  })
  lido: boolean;

  @ApiProperty({
    description: 'Data e hora de criação do recado',
    example: '2025-07-19T18:20:40.636Z',
    type: 'string',
    format: 'date-time',
  })
  data: Date;
}
