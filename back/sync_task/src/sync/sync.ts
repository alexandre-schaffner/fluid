/*
| Developed by Fluid
| Filename : sync.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { Platform, PrismaClient, User, Youtube } from "@prisma/client";
import { google } from "googleapis";

import { Video } from "../contracts/Video";
import { addToPlaylist } from "../spotify/addToPlaylist";
import { isInPlaylist } from "../spotify/isInPlaylist";
import { refreshAccessToken } from "../spotify/refreshToken";
import { searchTrack } from "../spotify/searchTrack";
import { getArtist } from "../utils/getArtist";
import { getBestMatch } from "../utils/getBestMatch";
import { getTitle } from "../utils/getTitle";
import { getLastLikedVideos } from "../youtube/getLastLikedVideos";

/*
|--------------------------------------------------------------------------
| Sync task
|--------------------------------------------------------------------------
*/

// Get YouTube client
//--------------------------------------------------------------------------
const getYouTubeClient = (refreshToken: string) => {
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

// Sync function
//--------------------------------------------------------------------------
export async function sync(
  user: User & { Platform: Platform; Youtube: Youtube }, // TODO: type this properly
  prisma: PrismaClient
) {
  if (!user.Youtube || !user.Platform) {
    throw new Error(`Cannot sync ${user.id}: the user has missing token(s).`);
  }
  if (!user.Platform.playlistUniqueRef) {
    throw new Error(
      `Cannot sync ${user.id}: the user has not set a playlist to sync.`
    );
  }

  const youtubeClient = getYouTubeClient(user.Youtube.refreshToken);

  const { lastLikedVideos, etag }: { lastLikedVideos: Video[]; etag: string } =
    await getLastLikedVideos(youtubeClient, user.Youtube.likedVideoEtag ?? "");

  if (lastLikedVideos.length === 0) return;

  // Get Spotify access token
  //--------------------------------------------------------------------------
  const accessToken = await refreshAccessToken(user.Platform.refreshToken);

  for (const video of lastLikedVideos) {
    try {
      // Check if the video has already been synced
      //--------------------------------------------------------------------------
      if (user.Youtube.lastLikedVideos.includes(video)) continue;

      const trackCache = await prisma.track.findFirst({
        where: {
          AND: [
            {
              videos: {
                some: video,
              },
            },
            { platform: user.Platform.type },
          ],
        },
      });

      let bestMatch;

      if (trackCache) {
        bestMatch = trackCache.uniqueRef;
      } else {
        // Try to retrieve an artist and a title from the video title
        //--------------------------------------------------------------------------
        const artist = getArtist(video);
        const title = getTitle(video);

        console.log(`Artist: ${artist}, Title: ${title}`);

        if (!artist || !title) continue;

        const search = await searchTrack(artist, title, accessToken);

        bestMatch = getBestMatch(search, artist, title);

        if (!bestMatch) {
          const searchRequest = `${search.request.method} ${search.request.protocol}//${search.request.host}${search.request.path}`;

          // Add the track to the not found collection
          //--------------------------------------------------------------------------
          console.log(
            `Adding [${video.id}]: ${artist} - ${title} to the not found collection`
          );
          await prisma.notFound.upsert({
            where: {
              searchRequest,
            },
            create: {
              artist,
              title,
              searchRequest,
              video,
              platform: user.Platform.type,
            },
            update: {},
          });
          console.log("Track added to the not found collection");
        } else {
          // Add or update the track to the database
          //--------------------------------------------------------------------------
          await prisma.track.upsert({
            where: {
              uniqueRef: bestMatch,
            },
            create: {
              artist,
              title,
              platform: user.Platform.type,
              uniqueRef: bestMatch,
              videos: [video],
            },
            update: {
              videos: {
                push: video,
              },
            },
          });
        }
      }

      // Add the track to the playlist if it's not already in it
      //--------------------------------------------------------------------------
      if (
        bestMatch &&
        !(await isInPlaylist(
          user.Platform.playlistUniqueRef,
          bestMatch,
          accessToken
        ))
      ) {
        await addToPlaylist(
          user.Platform.playlistUniqueRef,
          bestMatch,
          accessToken
        );
      }
    } catch (err: unknown) {
      console.error(err);
      continue;
    }
  }
  await prisma.youtube.update({
    where: {
      userId: user.id,
    },
    data: {
      lastLikedVideos,
      likedVideoEtag: etag,
    },
  });
}
