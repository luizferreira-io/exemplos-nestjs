import { Module } from '@nestjs/common';
import { RecadosController } from './recados/recados.controller';
import { RecadosService } from './recados/recados.service';

@Module({
  imports: [],
  controllers: [RecadosController],
  providers: [RecadosService],
})
export class AppModule {}
