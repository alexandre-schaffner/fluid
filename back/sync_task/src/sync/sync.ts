/*
| Developed by Fluid
| Filename : sync.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { Platform, User, Youtube } from "@prisma/client";
import { getPlatformAccessToken } from "../utils/getPlatformAccessToken";

import { addToPlaylist } from "../spotify/addToPlaylist";
import { isInPlaylist } from "../spotify/isInPlaylist";
import { searchTrack } from "../spotify/searchTrack";
import { getArtist } from "../utils/getArtist";
import { getBestMatch } from "../utils/getBestMatch";
import { getTitle } from "../utils/getTitle";
import { prisma } from "../utils/prismaClient";
import { getLastLikedVideos } from "../youtube/getLastLikedVideos";

/*
|--------------------------------------------------------------------------
| Sync task
|--------------------------------------------------------------------------
*/

// Sync function
//--------------------------------------------------------------------------
export async function sync(
  user: User & { platform: Platform; youtube: Youtube } // TODO: type this properly
) {
  console.log(`Syncing ${user.id}...`);
  if (!user.youtube || !user.platform) {
    throw new Error(`Cannot sync ${user.id}: the user has missing token(s).`);
  }
  if (!user.platform.playlistUniqueRef) {
    throw new Error(
      `Cannot sync ${user.id}: the user has not set a playlist to sync.`
    );
  }

  const { lastLikedVideos, etag } = await getLastLikedVideos(
    user.youtube.refreshToken,
    user.youtube.likedVideoEtag ?? ""
  );

  if (lastLikedVideos.length === 0) return;

  let accessToken = await getPlatformAccessToken(user);

  for (const video of lastLikedVideos) {
    try {
      // Check if the video has already been synced
      //--------------------------------------------------------------------------
      if (user.youtube.lastLikedVideos.includes(video)) continue;

      const trackCache = await prisma.track.findFirst({
        where: {
          AND: [
            {
              videos: {
                some: video,
              },
            },
            { platform: user.platform.type },
          ],
        },
      });

      let bestMatch;

      if (trackCache) {
        bestMatch = trackCache.uniqueRef;
        console.log(`Track ${trackCache.title} found in the cache`);
      } else {
        // Try to retrieve an artist and a title from the video title
        //--------------------------------------------------------------------------
        const artist = getArtist(video);
        const title = getTitle(video);

        console.log(`Artist: ${artist}, Title: ${title}`);

        if (!artist || !title) continue;

        const search = await searchTrack(
          artist,
          title,
          accessToken,
          user.platform.type
        );

        bestMatch = getBestMatch(search, artist, title);

        if (!bestMatch) {
          // Add the track to the not found collection
          //--------------------------------------------------------------------------
          console.log(
            `Adding [${video.id}]: ${artist} - ${title} to the not found collection`
          );
          await prisma.notFound.upsert({
            where: {
              searchRequest: search.searchRequest,
            },
            create: {
              artist,
              title,
              searchRequest: search.searchRequest,
              video,
              platform: user.platform.type,
            },
            update: {},
          });
          continue;
        } else {
          console.log(
            `Adding [${bestMatch}]: ${artist} - ${title} to the cache`
          );
          // Add or update the track to the database
          //--------------------------------------------------------------------------
          await prisma.track.upsert({
            where: {
              uniqueRef: bestMatch,
            },
            create: {
              artist,
              title,
              platform: user.platform.type,
              uniqueRef: bestMatch,
              videos: [video],
            },
            update: {
              videos: {
                push: video,
              },
              users: {
                connect: { id: user.id },
              },
            },
          });
        }
      }

      // Add the track to the playlist if it's not already in it
      //--------------------------------------------------------------------------
      if (
        await isInPlaylist(
          user.platform.playlistUniqueRef,
          bestMatch,
          accessToken,
          user.platform.type
        )
      )
        continue;

      await addToPlaylist(
        user.platform.playlistUniqueRef,
        bestMatch,
        accessToken,
        user.platform.type
      );

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          tracks: {
            connect: {
              uniqueRef: bestMatch,
            },
          },
        },
      });

      console.log(
        `[${bestMatch}] added to the playlist [${user.platform.playlistUniqueRef}]`
      );
    } catch (err: unknown) {
      console.error(err);
      continue;
    }
  }

  // Update the user's last liked videos cache
  //--------------------------------------------------------------------------
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
