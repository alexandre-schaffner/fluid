import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { DeezerController } from './deezer.controller';
import { DeezerService } from './deezer.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [DeezerController],
  providers: [DeezerService],
  exports: [DeezerService],
})
export class DeezerModule {}
