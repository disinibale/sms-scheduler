import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('application.port');
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  const apiDocumentConfig = new DocumentBuilder()
    .setTitle('SMS Scheduler')
    .setDescription(
      'SMS Scheduler API Documentation (Forest Interactive Hiring Procedure)',
    )
    .setVersion('1.0')
    .addTag('sms')
    .build();
  const document = SwaggerModule.createDocument(app, apiDocumentConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
}
bootstrap();
