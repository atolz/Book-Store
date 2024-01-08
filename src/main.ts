import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { TrimPipe } from './pipes/trim-whitespace.pipe';
import { CustomExceptionFilter } from './filters/custom-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalPipes(new TrimPipe());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // -------------------Swagger Setup--------------------------

  const config = new DocumentBuilder()
    .setTitle('Books store')
    .setDescription('Books store API document')
    .setVersion('1.0')
    .addTag('cats')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // -------------------Swagger Setup--------------------------

  await app.listen(3000);
}
bootstrap();
