/*
| Developed by Starton
| Filename : sync.service.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { Injectable } from '@nestjs/common';
import { Interval, SchedulerRegistry } from '@nestjs/schedule';
import { google } from 'googleapis';
import { SyncEntry } from 'src/contracts/SyncEntry';
import { PrismaService } from 'src/prisma/prisma.service';
import { getArtist } from 'src/utils/getArtist';
import { getTitle } from 'src/utils/getTitle';

/*
|--------------------------------------------------------------------------
| SYNCING SERVICE
|--------------------------------------------------------------------------
*/

@Injectable()
export class SyncService {
  private readonly syncMap: Map<string, SyncEntry> = new Map();

  constructor(
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly prismaService: PrismaService,
  ) {}

  // Sync every 3 minutes
  //--------------------------------------------------------------------------
  @Interval('sync', 1000 * 60 * 3)
  async sync() {
    console.log('syncing');

    // Iterate over the syncMap
    //--------------------------------------------------------------------------
    for (const [key, value] of this.syncMap.entries()) {
      // Retrieve the list of the title of the last 5 liked videos by the user
      //--------------------------------------------------------------------------
      const list = await value.youtube.videos.list(
        {
          part: ['snippet'],
          fields:
            'items(snippet/title,snippet/categoryId,snippet/channelTitle),etag',
          myRating: 'like',
        },
        {
          headers: { 'If-None-Match': value.etag },
        },
      );
      if (list.status === 304) continue;

      // TODO: Detect music videos and add them to the streaming platform
      //--------------------------------------------------------------------------
      for (const item of list.data.items!) {
        const artist = getArtist(item.snippet!);
        const title = getTitle(item.snippet!);
        if (!artist || !title) continue;
        console.log('artist:', artist, 'title:', title);
      }

      value.lastLikedVideosCache = list.data.items!.map((item) => {
        return {
          title: item.snippet!.title!,
          categoryId: item.snippet!.categoryId!,
        };
      });
      value.etag = list.data.etag!;

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

    console.log(tokens);

    for (const item of tokens) {
      if (!item.YouTubeToken || !item.Platform) {
        console.error(`Cannot sync ${item.id}: the user has token(s) missing.`);
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

    const youtubeRefreshToken = (
      await this.prismaService.youTubeToken.findUniqueOrThrow({
        where: { userId },
        select: { refreshToken: true },
      })
    ).refreshToken;
    const platformRefreshToken = (
      await this.prismaService.platform.findUniqueOrThrow({
        where: { userId },
        select: { refreshToken: true },
      })
    ).refreshToken;

    googleClient.setCredentials({
      refresh_token: youtubeRefreshToken,
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
