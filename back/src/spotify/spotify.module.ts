import { Module } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { SpotifyController } from './spotify.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SpotifyService],
  controllers: [SpotifyController],
  exports: [SpotifyService],
})
export class SpotifyModule {}
