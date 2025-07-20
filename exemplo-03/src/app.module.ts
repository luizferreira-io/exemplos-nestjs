import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './config/env-validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validateEnv, // Usa nossa função de validação personalizada
      isGlobal: true, // Registra o módulo globalmente
      // Especificando arquivos .env:
      //   envFilePath: '.env',
      //   envFilePath: ['.env', '.env.development', './config/config.env'],
      // Para ignorar o arquivo .env e pegar
      // os valores exportados pelo sistema operacional:
      //   ignoreEnvFile: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
