import { Test, TestingModule } from '@nestjs/testing';
import { RecadosModule } from './recados.module';
import { RecadosController } from './recados.controller';
import { RecadosService } from './recados.service';

describe('RecadosModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [RecadosModule],
    }).compile();
  });

  it('should compile the module', () => {
    expect(module).toBeDefined();
  });

  it('should provide RecadosController', () => {
    const controller = module.get<RecadosController>(RecadosController);
    expect(controller).toBeDefined();
  });

  it('should provide RecadosService', () => {
    const service = module.get<RecadosService>(RecadosService);
    expect(service).toBeDefined();
  });
});
