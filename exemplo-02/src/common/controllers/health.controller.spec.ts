import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should return health status', () => {
      const result = controller.check();

      expect(result).toBeDefined();
      expect(result.status).toBe('ok');
      expect(result.timestamp).toBeDefined();
      expect(typeof result.timestamp).toBe('string');
      expect(result.uptime).toBeDefined();
      expect(typeof result.uptime).toBe('number');
      expect(result.memory).toBeDefined();
      expect(result.memory.rss).toBeDefined();
      expect(result.memory.heapTotal).toBeDefined();
      expect(result.memory.heapUsed).toBeDefined();
      expect(result.memory.external).toBeDefined();
    });

    it('should return a valid ISO timestamp', () => {
      const result = controller.check();

      expect(result.timestamp).toBeDefined();
      expect(typeof result.timestamp).toBe('string');
      // Verificar se é uma data ISO válida
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });
  });
});
