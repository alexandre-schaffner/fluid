/*
| Developed by Fluid
| Filename : platform.service.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { Injectable } from '@nestjs/common';
import { PlaylistMetadata } from 'src/contracts/PlaylistMetadata';
import { DeezerService } from 'src/deezer/deezer.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpotifyService } from 'src/spotify/spotify.service';

/*
|--------------------------------------------------------------------------
| Music streaming platform service
|--------------------------------------------------------------------------
*/

@Injectable()
export class StreamingPlatformService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly spotifyService: SpotifyService,
    private readonly deezerService: DeezerService,
  ) {}

  // Get user's playlist depending on the platform
  //--------------------------------------------------------------------------
  async getPlaylists(userId: string): Promise<PlaylistMetadata[]> {
    try {
      const platform = await this.prisma.platform.findFirstOrThrow({
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
          return await this.deezerService.getPlaylists(platform.refreshToken);
      }
    } catch (err: unknown) {
      console.error(err);
      return [];
    }
  }

  // Set the playlist to sync
  //--------------------------------------------------------------------------
  async setPlaylist(userId: string, playlistId: string) {
    await this.prisma.platform.update({
      data: {
        playlistUniqueRef: playlistId,
      },
      where: {
        userId,
      },
    });
  }
}
