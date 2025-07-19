import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthStatus } from '../interfaces/health.interface';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @ApiOperation({ summary: 'Verificar saúde da aplicação' })
  @ApiResponse({
    status: 200,
    description: 'Status da aplicação retornado com sucesso',
    type: 'object',
  })
  @Public()
  @Get()
  check(): HealthStatus {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }
}
