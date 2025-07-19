import { ApiProperty } from '@nestjs/swagger';

export class RecadoUpdateDto {
  @ApiProperty({
    description: 'Nome da pessoa que está enviando o recado',
    example: 'João',
    type: 'string',
    required: false,
  })
  de?: string;

  @ApiProperty({
    description: 'Nome da pessoa que receberá o recado',
    example: 'Maria',
    type: 'string',
    required: false,
  })
  para?: string;

  @ApiProperty({
    description: 'Texto do recado',
    example: 'Lembrete: reunião às 14h hoje!',
    type: 'string',
    required: false,
  })
  texto?: string;
}
