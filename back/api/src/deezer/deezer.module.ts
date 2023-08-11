import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { VerifyJwtGuard } from 'src/guards/verify-jwt.guard';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';

import { DeezerController } from './deezer.controller';
import { DeezerService } from './deezer.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [DeezerController],
  providers: [DeezerService],
})
export class DeezerModule {}
