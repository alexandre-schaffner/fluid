import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class StreamingPlatformService {
  constructor(private readonly prismaService: PrismaService) {}

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
          return await this.getSpotifyPlaylists(
            platform.userUniqueRef,
            platform.refreshToken,
          );
        case 'DEEZER':
          return await this.getDeezerPlaylists(userId);
      }
    } catch (err: unknown) {
      return null;
    }
  }

  async getSpotifyPlaylists(userUniqueRef: string, refreshToken: string) {
    const res = await axios.get(
      `https://api.spotify.com/v1/users/${userUniqueRef}/playlists`,
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    );

    console.log(res.data);

    return;
  }

  async getDeezerPlaylists(userId: string) {
    return;
  }

  getSyncPlaylist() {
    return 'sync-playlists';
  }
}
