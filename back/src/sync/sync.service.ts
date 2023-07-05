/*
| Developed by Starton
| Filename : sync.service.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { Injectable } from '@nestjs/common';
import { Interval, SchedulerRegistry } from '@nestjs/schedule';
import { Token } from '@prisma/client';
import { google } from 'googleapis';
import { SyncEntry } from 'src/contracts/SyncEntry';
import { PrismaService } from 'src/prisma/prisma.service';

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
    for (const [key, value] of this.syncMap.entries()) {
      const list = await value.youtube.videos.list(
        {
          part: ['snippet'],
          fields: 'items(snippet/title),etag',
          myRating: 'like',
        },
        {
          headers: { 'If-None-Match': value.etag },
        },
      );
      if (list.status === 304) continue;
      value.etag = list.data.etag!;
      this.syncMap.set(key, value);

      // TODO: Detect music videos and add them to the streaming platform
      //--------------------------------------------------------------------------
      for (const item of list.data.items!) {
        console.log(item.snippet!.title);
      }
    }
  }

  // Init the syncMap with the synced users
  //--------------------------------------------------------------------------
  initSync(tokens: Token[]) {
    for (const token of tokens) {
      const googleClient = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI,
      );

      googleClient.setCredentials({
        refresh_token: token.youtubeRefreshToken!,
      });

      const youtube = google.youtube({
        version: 'v3',
        auth: googleClient,
      });

      this.syncMap.set(token.userId, {
        youtube,
        streamingPlatformRefreshToken: token.streamingPlatformRefreshToken!,
        etag: undefined,
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

    const tokens = await this.prismaService.token.findUnique({
      where: { userId },
    });

    googleClient.setCredentials({
      refresh_token: tokens!.youtubeRefreshToken!,
    });

    const youtube = google.youtube({
      version: 'v3',
      auth: googleClient,
    });

    this.syncMap.set(userId, {
      youtube,
      streamingPlatformRefreshToken: tokens!.streamingPlatformRefreshToken!,
      etag: undefined,
    });

    // TODO: Use an interceptor to make db request after the response is sent
    //--------------------------------------------------------------------------
    await this.prismaService.token.update({
      where: { userId },
      data: { sync: true },
    });
  }

  async disableSync(userId: string) {
    this.syncMap.delete(userId);

    // TODO: Use an interceptor to make db request after the response is sent
    //--------------------------------------------------------------------------
    await this.prismaService.token.update({
      where: { userId },
      data: { sync: false },
    });
  }
}
