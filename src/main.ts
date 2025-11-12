import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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
    }),
  );

  /*
   * Swagger setup
   */
  const config = new DocumentBuilder()
    .setTitle('Blog app api')
    .setDescription('Use the base API url as https://your-domain.com/api')
    .addServer('/http://localhost:3000', 'Local server')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(3000);
}

bootstrap()
  .then(() => {
    console.log('Application is running on: http://localhost:3000');
  })
  .catch((err) => {
    console.error('Error during application bootstrap:', err);
  });
