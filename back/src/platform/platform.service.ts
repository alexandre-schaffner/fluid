/*
| Developed by Starton
| Filename : platform.service.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpotifyService } from 'src/spotify/spotify.service';
import { SyncService } from 'src/sync/sync.service';

/*
|--------------------------------------------------------------------------
| Music streaming platform service
|--------------------------------------------------------------------------
*/

@Injectable()
export class StreamingPlatformService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly spotifyService: SpotifyService,
    private readonly syncService: SyncService,
  ) {}

  // Get user's playlist depending on the platform
  //--------------------------------------------------------------------------
  async getPlaylists(userId: string) {
    try {
      const platform = await this.prismaService.platform.findFirstOrThrow({
        where: {
          userId,
        },
        select: {
          type: true,
          refreshToken: true,
          userUniqueRef: true,
        },
      });

      switch (platform.type) {
        case 'SPOTIFY':
          return await this.spotifyService.getPlaylists(
            platform.userUniqueRef,
            platform.refreshToken,
          );
        case 'DEEZER':
          return;
      }
    } catch (err: unknown) {
      console.error(err);
      return null;
    }
  }

  // Set the playilst to sync
  //--------------------------------------------------------------------------
  async setPlaylist(userId: string, playlistId: string) {
    try {
      const platform = await this.prismaService.platform.findFirstOrThrow({
        where: {
          userId,
        },
        select: {
          type: true,
          refreshToken: true,
          userUniqueRef: true,
        },
      });

      switch (platform.type) {
        case 'SPOTIFY':
          return await this.spotifyService.setPlaylist(userId, playlistId);
        case 'DEEZER':
          return;
      }
    } catch (err: unknown) {
      console.error(err);
      return null;
    }
  }

  // Set the sync status
  //--------------------------------------------------------------------------
  async setSync(userId: string, sync: boolean) {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        sync,
      },
    });
    this.syncService.enableSync(userId);
  }
}
