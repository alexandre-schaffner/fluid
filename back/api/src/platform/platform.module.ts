import { Module } from '@nestjs/common';
import { StreamingPlatformController } from './platform.controller';
import { StreamingPlatformService } from './platform.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SpotifyModule } from 'src/spotify/spotify.module';

@Module({
  imports: [PrismaModule, SpotifyModule],
  controllers: [StreamingPlatformController],
  providers: [StreamingPlatformService],
})
export class StreamingPlatformModule {}
