import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { config } from 'aws-sdk';

/**
 * Bootstraps the Nest HTTP server, global validation, and Swagger documentation
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /*
   * Use validation pipes globally
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove non-whitelisted properties
      forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  /*
   * Swagger setup
   */
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Blog app api')
    .setDescription('Use the base API url as https://your-domain.com/api')
    // .addServer('http://localhost:3000', 'Local server')
    .setVersion('1.0')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documentFactory);

  // Setup AWS SDK
  const configService = app.get(ConfigService);
  config.update({
    region: configService.get<string>('app.aws.region') ?? '',
    credentials: {
      accessKeyId: configService.get<string>('app.aws.accessKeyId') ?? '',
      secretAccessKey:
        configService.get<string>('app.aws.secretAccessKey') ?? '',
    },
  });

  app.enableCors({
    origin: '*',
  });

  await app.listen(3000);
}

bootstrap()
  .then(() => {
    console.log('Application is running on port 3000');
  })
  .catch((err) => {
    console.error('Error during application bootstrap:', err);
  });
