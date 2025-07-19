import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Nome de usuário para login',
    example: 'admin',
    type: 'string',
  })
  username: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'admin123',
    type: 'string',
    format: 'password',
  })
  password: string;
}

class UserDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: '1',
    type: 'string',
  })
  id: string;

  @ApiProperty({
    description: 'Nome de usuário',
    example: 'admin',
    type: 'string',
  })
  username: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'Token JWT para autenticação',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: 'string',
  })
  access_token: string;

  @ApiProperty({
    description: 'Dados do usuário autenticado',
    type: UserDto,
  })
  user: {
    id: string;
    username: string;
  };
}
