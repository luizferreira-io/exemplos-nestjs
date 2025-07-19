import { ApiProperty } from '@nestjs/swagger';

export class RecadoCreateDto {
  @ApiProperty({
    description: 'Nome da pessoa que está enviando o recado',
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
    description: 'Texto do recado',
    example: 'Lembrete: reunião às 14h hoje!',
    type: 'string',
  })
  texto: string;
}
