import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => {
      const messages = errors.map(e => `${e.property}: ${Object.values(e.constraints ?? {}).join(', ')}`);
      return new BadRequestException(messages);
    },
  }));

  app.enableCors({ origin: process.env.WEB_ORIGIN || 'http://localhost:3000' });
  await app.listen(3001);
}
bootstrap();
