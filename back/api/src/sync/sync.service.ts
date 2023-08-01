/*
| Developed by Fluid
| Filename : sync.service.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { SyncEntry } from 'src/contracts/SyncEntry';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpotifyService } from 'src/spotify/spotify.service';
import { YoutubeService } from 'src/youtube/youtube.service';

/*
|--------------------------------------------------------------------------
| Syncing service
|--------------------------------------------------------------------------
*/

@Injectable()
export class SyncService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly youtubeService: YoutubeService,
    private readonly spotifyService: SpotifyService,
  ) {}

  // Enable syncing between YouTube and the streaming platform
  //--------------------------------------------------------------------------
  async enableSync(userId: string) {
    const tokens = await this.prismaService.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        Platform: {
          select: { refreshToken: true, playlistUniqueRef: true, type: true },
        },
        Youtube: { select: { refreshToken: true } },
      },
    });

    const youtubeRefreshToken = tokens.Youtube?.refreshToken;
    const platformRefreshToken = tokens.Platform?.refreshToken;
    const playlistId = tokens.Platform?.playlistUniqueRef;
    const platform = tokens.Platform?.type;

    if (
      !youtubeRefreshToken ||
      !platformRefreshToken ||
      !playlistId ||
      !platform
    )
      throw new Error(
        'Cannot sync: the user has not connected its music streaming platform or has not set a playlist to sync.',
      );

    await this.prismaService.user.update({
      where: { id: userId },
      data: { sync: true },
    });
  }

  async disableSync(userId: string) {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { sync: false },
    });
  }
}
