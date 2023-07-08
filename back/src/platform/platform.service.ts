import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';
import querystring from 'querystring';

@Injectable()
export class StreamingPlatformService {
  private readonly encodedCredentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
  ).toString('base64');

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
          const accessToken = await axios.post(
            'https://accounts.spotify.com/api/token',
            querystring.stringify({
              grant_type: 'refresh_token',
              refresh_token: platform.refreshToken,
            }),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + this.encodedCredentials,
              },
            },
          );
          return await this.getSpotifyPlaylists(
            platform.userUniqueRef,
            accessToken.data.access_token,
          );
        case 'DEEZER':
          return await this.getDeezerPlaylists(userId);
      }
    } catch (err: unknown) {
      console.error(err);
      return null;
    }
  }

  async getSpotifyPlaylists(userUniqueRef: string, accessToken: string) {
    const res = await axios.get(
      `https://api.spotify.com/v1/users/${userUniqueRef}/playlists`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const playlists = [];
    for (const item of res.data.items) {
      playlists.push({
        href: item.href,
        name: item.name,
        description: item.description,
        length: item.tracks.total,
        image: item.images[0].url,
      });
    }
    return playlists;
  }

  async getDeezerPlaylists(userId: string) {
    return;
  }

  getSyncPlaylist() {
    return 'sync-playlists';
  }
}
