import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './app/common/exception/http-exception.filter';
import { setupSwagger } from './app/common/docs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const configService = app.get(ConfigService);

  // Get configuration values with defaults
  const port = configService.get<number>('PORT', 8000);
  const env = configService.get<string>('NODE_ENV', 'development');
  const swaggerEnabled = configService.get<boolean>(
    'SWAGGER_ENABLED',
    env === 'development',
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

  app.enableCors({ origin: 'http://localhost:3000', credentials: true });

  await app.listen(port);

  logger.log(`🚀 Server running on ${port} (${configService.get('NODE_ENV')})`);
  if (swaggerEnabled) {
    logger.log(
      `🟩 API Documentation available at http://localhost:${port}/api/docs`,
    );
  }
}
void bootstrap();
