import { Module, OnModuleInit } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpotifyModule } from 'src/spotify/spotify.module';
import { YoutubeModule } from 'src/youtube/youtube.module';

import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';

@Module({
  imports: [PrismaModule, YoutubeModule, SpotifyModule],
  providers: [SyncService],
  controllers: [SyncController],
  exports: [SyncService],
})
export class SyncModule {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly syncService: SyncService,
  ) {}
}