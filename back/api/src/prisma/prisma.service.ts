/*
| Developed by Fluid
| Filename : prisma.service.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/*
|--------------------------------------------------------------------------
| PRISMA CLIENT
|--------------------------------------------------------------------------
*/

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
