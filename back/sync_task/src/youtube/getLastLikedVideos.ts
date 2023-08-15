/*
| Developed by Fluid
| Filename : getLastLikedVideos.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { google } from "googleapis";
import { prisma } from "src/utils/prismaClient";
import { Video } from "../contracts/Video";

/*
|--------------------------------------------------------------------------
| Retrieve the list of the last 5 videos liked by the user
|--------------------------------------------------------------------------
*/

// Get youtube client
//--------------------------------------------------------------------------
const getyoutubeClient = (refreshToken: string) => {
  const googleClient = new google.auth.OAuth2(
    process.env["GOOGLE_CLIENT_ID"],
    process.env["GOOGLE_CLIENT_SECRET"],
    process.env["GOOGLE_REDIRECT_URI"]
  );

  googleClient.setCredentials({
    refresh_token: refreshToken,
  });

  return google.youtube({
    version: "v3",
    auth: googleClient,
  });
};

export async function getLastLikedVideos(
  refreshToken: string,
  lastETag = ""
): Promise<{ lastLikedVideos: Video[]; etag: string }> {
  const youtubeClient = getyoutubeClient(refreshToken);

  const list = await youtubeClient.videos.list(
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
