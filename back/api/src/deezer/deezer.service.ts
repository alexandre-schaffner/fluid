import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';

import { PlaylistMetadata } from '../contracts/PlaylistMetadata';

@Injectable()
export class DeezerService {
  private readonly axiosInstance = axios.create({
    baseURL: 'https://api.deezer.com',
  });

  constructor(private readonly prisma: PrismaService) {}

  async exchangeCodeForTokens(code: string, userId: string) {
    const accessToken = (
      await axios.get(
        `https://connect.deezer.com/oauth/access_token.php?app_id=${process.env.DEEZER_APP_ID}&secret=${process.env.DEEZER_SECRET}&code=${code}&output=json`,
      )
    ).data.access_token;

    const res = await this.axiosInstance.get(
      `/user/me?access_token=${accessToken}`,
    );

    await this.prisma.platform.upsert({
      create: {
        type: 'DEEZER',
        refreshToken: accessToken,
        user: {
          connect: {
            id: userId,
          },
        },
        userUniqueRef: String(res.data.id),
      },
      update: {
        type: 'DEEZER',
        refreshToken: accessToken,
        userUniqueRef: String(res.data.id),
      },
      where: {
        userId,
      },
    });

    return accessToken;
  }

  // Get user playlists
  //--------------------------------------------------------------------------
  async getPlaylists(accessToken: string): Promise<PlaylistMetadata[]> {
    const res = await this.axiosInstance.get(
      `/user/me/playlists?access_token=${accessToken}`,
    );
    const playlists: PlaylistMetadata[] = [];

    for (const item of res.data.data) {
      playlists.push({
        id: String(item.id),
        name: item.title,
        image: item.picture,
        length: item.nb_tracks,
        href: item.link,
        tracks: [],
        isSync: false,
      });
    }

    return playlists;
  }
}
