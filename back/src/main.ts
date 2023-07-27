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
    origin: ['http://localhost:3000', 'https://fluid-plum.vercel.app/'],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 8000, '0.0.0.0');
}
bootstrap();
