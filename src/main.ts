import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { Config } from './config/config-schema';
import { Logger, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './app/common/docs/swagger';
import { HttpExceptionFilter } from './app/common/exception/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<Config>);

  // Get configuration values with defaults
  const port = configService.get<number>('PORT', 8000);
  const environment = configService.get<string>('NODE_ENV', 'development');
  const swaggerEnabled = configService.get<boolean>(
    'SWAGGER_ENABLED',
    environment === 'development',
  );

  // Global Exception Filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Request Validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      stopAtFirstError: false,
    }),
  );

  // Swagger Documentation
  if (swaggerEnabled) {
    setupSwagger(app);
  }

  await app.listen(port);

  logger.log(`🚀 Server running on ${port} (${configService.get('NODE_ENV')})`);
  if (swaggerEnabled) {
    logger.log(
      `🟩 API Documentation available at http://localhost:${port}/api/docs`,
    );
  }
}

void bootstrap();
