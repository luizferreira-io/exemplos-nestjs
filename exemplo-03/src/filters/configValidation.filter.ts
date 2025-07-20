import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class ConfigValidationFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Para erros HTTP de runtime relacionados a config
    if (exception instanceof HttpException) {
      console.error('🚨 ERRO DE CONFIGURAÇÃO EM RUNTIME:');
      console.error('Detalhes:', exception.message);

      response.status(500).json({
        statusCode: 500,
        message: 'Erro de configuração da aplicação',
        error: 'Configuration Error',
        details: exception.message,
      });
    } else {
      // Para outros tipos de erro
      console.error('🚨 ERRO INESPERADO:', exception.message);

      response.status(500).json({
        statusCode: 500,
        message: 'Erro interno do servidor',
        error: 'Internal Server Error',
      });
    }
  }
}
