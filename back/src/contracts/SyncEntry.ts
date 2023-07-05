import { youtube_v3 } from 'googleapis';

export interface SyncEntry {
  youtube: youtube_v3.Youtube;
  etag: string | undefined;
  streamingPlatformRefreshToken: string;
}
