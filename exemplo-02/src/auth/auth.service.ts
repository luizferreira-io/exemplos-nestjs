import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { User, JwtPayload } from './interfaces/auth.interface';
import { LoginDto, LoginResponseDto } from './dtos/auth.dto';

@Injectable()
export class AuthService {
  private adminUser: User;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    // Inicializar usuário admin com senha hashada
    this.initializeAdminUser();
  }

  private async initializeAdminUser(): Promise<void> {
    const username = this.configService.get<string>('auth.adminUsername') || 'admin';
    const password = this.configService.get<string>('auth.adminPassword') || 'admin123';

    // Hash da senha usando Argon2
    const hashedPassword = await argon2.hash(password);

    this.adminUser = {
      id: '1',
      username,
      password: hashedPassword,
    };
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    // Aguardar a inicialização do usuário admin se ainda não foi feita
    if (!this.adminUser) {
      await this.initializeAdminUser();
    }

    if (username === this.adminUser.username) {
      try {
        // Verificar senha usando Argon2
        const isValidPassword = await argon2.verify(this.adminUser.password, password);
        if (isValidPassword) {
          const { password: _, ...result } = this.adminUser;
          return result as User;
        }
      } catch (error) {
        // Log do erro se necessário
        return null;
      }
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(loginDto.username, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  async validateJwtPayload(payload: JwtPayload): Promise<User | null> {
    // Em um sistema real, você buscaria o usuário no banco de dados
    if (payload.username === this.adminUser?.username) {
      const { password: _, ...result } = this.adminUser;
      return result as User;
    }
    return null;
  }
}
