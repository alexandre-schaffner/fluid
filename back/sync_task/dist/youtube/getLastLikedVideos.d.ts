import { youtube_v3 } from "googleapis";
import { Video } from "../contracts/Video";
export declare function getLastLikedVideos(youtube: youtube_v3.Youtube, lastETag?: string): Promise<{
    lastLikedVideos: Video[];
    etag: string;
}>;
