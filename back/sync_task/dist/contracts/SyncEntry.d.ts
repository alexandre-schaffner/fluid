import { youtube_v3 } from "googleapis";
import { Video } from "./Video";
export interface SyncEntry {
    youtube: youtube_v3.Youtube;
    etag: string | undefined;
    streamingPlatformRefreshToken: string;
    lastLikedVideosCache: Video[];
    playlistId: string;
    platform: string;
}
