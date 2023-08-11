import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StreamingPlatformModule } from './platform/platform.module';
import { PrismaModule } from './prisma/prisma.module';
import { SpotifyModule } from './spotify/spotify.module';
import { YoutubeModule } from './youtube/youtube.module';
import { DeezerModule } from './deezer/deezer.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AuthModule,
    PrismaModule,
    StreamingPlatformModule,
    SpotifyModule,
    YoutubeModule,
    DeezerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
