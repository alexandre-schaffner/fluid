/*
| Developed by Fluid
| Filename : SyncEntry.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { youtube_v3 } from "googleapis";

import { Video } from "./Video";

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
