import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    // Para usar configService tipado somente
    // com os atributos que serão usados:
    // private readonly configService: ConfigService<{
    //   POSTGRESQL_SERVER: string;
    //   POSTGRESQL_PORT: number;
    // }>,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
}
