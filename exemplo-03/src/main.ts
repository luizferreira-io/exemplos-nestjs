import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigValidationFilter } from './filters/configValidation.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ConfigValidationFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
