import { Module } from '@nestjs/common';
import { StreamingPlatformController } from './platform.controller';
import { StreamingPlatformService } from './platform.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SpotifyModule } from 'src/spotify/spotify.module';
import { DeezerModule } from 'src/deezer/deezer.module';

@Module({
  imports: [PrismaModule, SpotifyModule, DeezerModule],
  controllers: [StreamingPlatformController],
  providers: [StreamingPlatformService],
  exports: [StreamingPlatformService],
})
export class StreamingPlatformModule {}
