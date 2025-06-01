import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Sets up Swagger documentation for the API
 * Only enabled in non-production environments by default
 */
export const setupSwagger = (app: INestApplication): void => {
  const configService = app.get(ConfigService);
  const isSwaggerEnabled = configService.get<boolean>('SWAGGER_ENABLED');
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  // Only enable Swagger in non-production environments unless explicitly configured
  if (isProduction && !isSwaggerEnabled) {
    return;
  }

  const options = new DocumentBuilder()
    .setTitle('Tedarikcim API Documentation')
    .setVersion('1.0.0')
    .setContact(
      'Tedarikcim Developer',
      'https://github.com/muratmutluu',
      'devmuratmutlu@google.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer(
      `http://localhost:${configService.get('PORT')}`,
      'Local Development',
    )
    .addTag('Authentication', 'User authentication and authorization endpoints')
    .addTag('Users', 'User management endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    deepScanRoutes: true,
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  // Add custom Swagger configuration
  SwaggerModule.setup('api/docs', app, document, {
    // explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      filter: true,
      showCommonExtensions: true,
      syntaxHighlight: {
        theme: 'monokai',
      },
      tryItOutEnabled: true,
      defaultModelsExpandDepth: 3,
      defaultModelExpandDepth: 3,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Tedarikcim API Docs',
  });
};
