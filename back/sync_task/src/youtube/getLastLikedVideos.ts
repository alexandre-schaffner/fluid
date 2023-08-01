/*
| Developed by Fluid
| Filename : getLastLikedVideos.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { youtube_v3 } from "googleapis";

import { Video } from "../contracts/Video";

/*
|--------------------------------------------------------------------------
| Retrieve the list of the last 5 videos liked by the user
|--------------------------------------------------------------------------
*/

export async function getLastLikedVideos(
  youtube: youtube_v3.Youtube,
  lastETag = ""
) {
  const list = await youtube.videos.list(
    {
      part: ["snippet"],
      fields:
        "items(snippet/title,snippet/categoryId,snippet/channelTitle,id),etag",
      myRating: "like",
    },
    {
      headers: { "If-None-Match": lastETag },
    }
  );

  // Return an empty array if the list hasn't changed since the last request
  //--------------------------------------------------------------------------
  if (list.status === 304) return { lastLikedVideos: [], etag: lastETag };

  // Transform the list into a list of Video objects and return it
  //--------------------------------------------------------------------------
  const lastLikedVideos: Video[] = list.data.items!.map((item) => {
    return {
      id: item.id!,
      channelTitle: item.snippet!.channelTitle!,
      title: item.snippet!.title!,
      categoryId: item.snippet!.categoryId!,
    };
  });

  return { lastLikedVideos, etag: list.data.etag! };
}
