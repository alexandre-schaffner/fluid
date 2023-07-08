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
    origin: 'http://localhost:3000',
    credentials: true,
    // allowedHeaders: [
    //   'Content-Type',
    //   'Authorization',
    //   'Set-Cookie',
    //   'Cookie',
    //   'Origin',
    // ],
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(8000);
}
bootstrap();
