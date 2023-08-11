import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { VerifyJwtGuard } from 'src/guards/verify-jwt.guard';
import { PrismaModule } from 'src/prisma/prisma.module';

import { SpotifyController } from './spotify.controller';
import { SpotifyService } from './spotify.service';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [SpotifyService, VerifyJwtGuard],
  controllers: [SpotifyController],
  exports: [SpotifyService],
})
export class SpotifyModule {}
