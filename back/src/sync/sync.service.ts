/*
| Developed by Fluid
| Filename : sync.service.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import axios from 'axios';
import { google } from 'googleapis';
import querystring from 'querystring';
import { SyncEntry } from 'src/contracts/SyncEntry';
import { Video } from 'src/contracts/Video';
import { PrismaService } from 'src/prisma/prisma.service';
import { SpotifyService } from 'src/spotify/spotify.service';
import { getArtist } from 'src/utils/getArtist';
import { getTitle } from 'src/utils/getTitle';
import { YoutubeService } from 'src/youtube/youtube.service';

/*
|--------------------------------------------------------------------------
| Syncing service
|--------------------------------------------------------------------------
*/

@Injectable()
export class SyncService {
  private readonly syncMap: Map<string, SyncEntry> = new Map();

  constructor(
    private readonly prismaService: PrismaService,
    private readonly youtubeService: YoutubeService,
    private readonly spotifyService: SpotifyService,
  ) {}

  // Sync every 3 minutes
  //--------------------------------------------------------------------------
  @Interval('sync', 1000 * 60 * 3)
  async sync() {
    // Iterate over the syncMap (one loop = one user)
    //--------------------------------------------------------------------------
    for (const [key, value] of this.syncMap.entries()) {
      // Retrieve the list of the last 5 videos liked by the user
      //--------------------------------------------------------------------------

      const {
        lastLikedVideos,
        etag,
      }: { lastLikedVideos: Video[]; etag: string } =
        await this.youtubeService.getLastLikedVideos(value.youtube, value.etag);

      if (lastLikedVideos.length === 0) continue;

      // Get Spotify access token
      //--------------------------------------------------------------------------
      const accessToken = await this.spotifyService.refreshAccessToken(
        value.streamingPlatformRefreshToken,
      );

      for (const video of lastLikedVideos) {
        // Check if the video has already been synced
        //--------------------------------------------------------------------------
        if (value.lastLikedVideosCache.includes(video)) continue;

        // Try to retrieve an artist and a title from the video title
        //--------------------------------------------------------------------------
        const artist = getArtist(video);
        const title = getTitle(video);

        if (!artist || !title) continue;

        // Search for the track on Spotify
        //--------------------------------------------------------------------------
        const queryStringified = querystring.stringify({
          q: `artist:${artist} track:${title}`,
          // q: `${artist} ${title}`,
          type: 'track',
          limit: 5,
        });

        const search = await axios.get(
          `https://api.spotify.com/v1/search?${queryStringified}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        // Loop over the results and try to find the best match
        //--------------------------------------------------------------------------
        let bestMatch = '';
        let bestMatchScore = 0;

        for (const item of search.data.tracks.items) {
          let score = 0;

          if (item.artists.map((artist: any) => artist.name).includes(artist))
            score++;
          if (item.name === title) score++;

          if (score > bestMatchScore) {
            bestMatch = item.id;
            bestMatchScore = score;
          }
        }

        // Add the track to the playlist if it's not already in it
        //--------------------------------------------------------------------------
        if (
          bestMatch &&
          !(await this.spotifyService.isInPlaylist(
            value.playlistId,
            bestMatch,
            accessToken,
          ))
        ) {
          await this.spotifyService.addToPlaylist(
            value.playlistId,
            bestMatch,
            accessToken,
          );
        }
      }

      value.lastLikedVideosCache = lastLikedVideos;
      value.etag = etag;

      this.syncMap.set(key, value);
    }
  }

  // Init the syncMap with the synced users
  //--------------------------------------------------------------------------
  async initSync() {
    const tokens = await this.prismaService.user.findMany({
      where: { sync: true },
      include: { Platform: true, YouTubeToken: true },
    });

    for (const item of tokens) {
      if (!item.YouTubeToken || !item.Platform) {
        console.error(`Cannot sync ${item.id}: the user has missing token(s).`);
        continue;
      }
      if (!item.Platform.playlistUniqueRef) {
        console.error(
          `Cannot sync ${item.id}: the user has not set a playlist to sync.`,
        );
        continue;
      }

      const googleClient = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI,
      );

      googleClient.setCredentials({
        refresh_token: item.YouTubeToken.refreshToken,
      });

      const youtube = google.youtube({
        version: 'v3',
        auth: googleClient,
      });

      this.syncMap.set(item.id, {
        youtube,
        streamingPlatformRefreshToken: item.Platform.refreshToken,
        etag: undefined,
        lastLikedVideosCache: [],
        playlistId: item.Platform.playlistUniqueRef,
        platform: item.Platform.type,
      });
    }
  }

  // Enable syncing between YouTube and the streaming platform
  //--------------------------------------------------------------------------
  async enableSync(userId: string) {
    const googleClient = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    const tokens = await this.prismaService.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        Platform: {
          select: { refreshToken: true, playlistUniqueRef: true, type: true },
        },
        YouTubeToken: { select: { refreshToken: true } },
      },
    });

    const youtubeRefreshToken = tokens.YouTubeToken?.refreshToken;
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

    googleClient.setCredentials({
      refresh_token: tokens.YouTubeToken?.refreshToken,
    });

    const youtube = google.youtube({
      version: 'v3',
      auth: googleClient,
    });

    this.syncMap.set(userId, {
      youtube,
      streamingPlatformRefreshToken: platformRefreshToken,
      etag: undefined,
      lastLikedVideosCache: [],
      playlistId,
      platform,
    });

    // TODO: Use an interceptor to make db request after the response is sent
    //--------------------------------------------------------------------------
    await this.prismaService.user.update({
      where: { id: userId },
      data: { sync: true },
    });
  }

  async disableSync(userId: string) {
    this.syncMap.delete(userId);

    // TODO: Use an interceptor to make db request after the response is sent
    //--------------------------------------------------------------------------
    await this.prismaService.user.update({
      where: { id: userId },
      data: { sync: false },
    });
  }
}
