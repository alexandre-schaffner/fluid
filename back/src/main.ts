import cors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(fastifyCookie, {});
  await app.register(cors, {
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://www.fluidsync.app']
        : ['http://localhost:3000'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(
    process.env.PORT || 8000,
    process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1',
  );
}
bootstrap();
