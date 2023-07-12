/*
| Developed by Starton
| Filename : SyncEntry.ts
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { youtube_v3 } from 'googleapis';

import { Video } from './Video';

/*
|--------------------------------------------------------------------------
| Sync map entry
|--------------------------------------------------------------------------
*/

export interface SyncEntry {
  youtube: youtube_v3.Youtube;
  etag: string | undefined;
  streamingPlatformRefreshToken: string;
  lastLikedVideosCache: Video[];
  playlistId: string;
  platform: string;
}

enum Platform {
  SPOTIFY = 'SPOTIFY',
  DEEZER = 'DEEZER',
}
