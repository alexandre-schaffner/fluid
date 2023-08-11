/*
| Developed by Fluid
| Filename : spotify.service.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';
import querystring from 'querystring';
import { PlaylistMetadata } from 'src/contracts/PlaylistMetadata';

/*
|--------------------------------------------------------------------------
| Spotify service
|--------------------------------------------------------------------------
*/

@Injectable()
export class SpotifyService {
  private readonly encodedCredentials = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
  ).toString('base64');

  constructor(private readonly prismaService: PrismaService) {}

  // Exchange authorization code for access and refresh tokens
  //--------------------------------------------------------------------------
  async exchangeCodeForTokens(code: string, userId: string) {
    try {
      let response = await axios.post(
        'https://accounts.spotify.com/api/token',
        `grant_type=authorization_code&code=${code}&redirect_uri=${process.env.BACKEND_HOST}/spotify/webhook/authorize`,
        {
          headers: {
            Authorization: 'Basic ' + this.encodedCredentials,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const refreshToken = response.data.refresh_token;

      response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: 'Bearer ' + response.data.access_token,
        },
      });

      const userUniqueRef = response.data.id;

      await this.prismaService.platform.upsert({
        create: {
          refreshToken,
          type: 'SPOTIFY',
          user: {
            connect: {
              id: userId,
            },
          },
          userUniqueRef,
        },
        update: {
          refreshToken,
          type: 'SPOTIFY',
          userUniqueRef,
        },
        where: {
          userId,
        },
      });
      return;
    } catch (err: unknown) {
      console.error(err);
      throw err;
    }
  }

  // Get Spotify access token from a refresh token
  //--------------------------------------------------------------------------
  async refreshAccessToken(refreshToken: string) {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
      {
        headers: {
          Authorization: `Basic ${this.encodedCredentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const accessToken = response.data.access_token;

    return accessToken;
  }

  // Get user playlists
  //--------------------------------------------------------------------------
  async getPlaylists(userUniqueRef: string, refreshToken: string) {
    const accessToken = await this.refreshAccessToken(refreshToken);
    const playlists: PlaylistMetadata[] = [];

    const res = await axios.get(
      `https://api.spotify.com/v1/users/${userUniqueRef}/playlists`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    for (const item of res.data.items) {
      playlists.push({
        href: item.href,
        name: item.name,
        length: item.tracks.total,
        image: item.images[0]?.url,
        id: item.id,
        tracks: [],
        isSync: false,
      });
    }

    return playlists;
  }

  // Set the playlist to sync
  //--------------------------------------------------------------------------
  async setPlaylist(userId: string, playlistId: string) {
    await this.prismaService.platform.update({
      data: {
        playlistUniqueRef: playlistId,
      },
      where: {
        userId,
      },
    });
  }
}
