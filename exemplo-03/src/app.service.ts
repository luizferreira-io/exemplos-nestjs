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
    console.log();
    console.log(`POSTGRESQL_SERVER = ${this.configService.get('POSTGRESQL_SERVER')}`);
    console.log(`POSTGRESQL_PORT = ${this.configService.get('POSTGRESQL_PORT')}`);
    console.log(`POSTGRESQL_DATABASE = ${this.configService.get('POSTGRESQL_DATABASE')}`);
    console.log();
    console.log(`POSTGRESQL_PORT com configService: ${typeof this.configService.get('POSTGRESQL_PORT')}`);
    console.log(`POSTGRESQL_PORT com process.env: ${typeof process.env.POSTGRESQL_USER}`);
    console.log();
    return 'Hello World!';
  }
}
