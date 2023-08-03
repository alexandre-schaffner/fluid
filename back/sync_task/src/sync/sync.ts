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
import { getTitle } from "../utils/getTitle";
import { getLastLikedVideos } from "../youtube/getLastLikedVideos";

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

  const googleClient = new google.auth.OAuth2(
    process.env["GOOGLE_CLIENT_ID"],
    process.env["GOOGLE_CLIENT_SECRET"],
    process.env["GOOGLE_REDIRECT_URI"]
  );

  googleClient.setCredentials({
    refresh_token: user.Youtube.refreshToken,
  });

  const youtube = google.youtube({
    version: "v3",
    auth: googleClient,
  });

  const { lastLikedVideos, etag }: { lastLikedVideos: Video[]; etag: string } =
    await getLastLikedVideos(youtube, user.Youtube.likedVideoEtag ?? "");

  if (lastLikedVideos.length === 0) return;

  // Get Spotify access token
  //--------------------------------------------------------------------------
  const accessToken = await refreshAccessToken(user.Platform.refreshToken);

  for (const video of lastLikedVideos) {
    // Check if the video has already been synced
    //--------------------------------------------------------------------------
    if (user.Youtube.lastLikedVideos.includes(video)) continue;

    // Try to retrieve an artist and a title from the video title
    //--------------------------------------------------------------------------
    const artist = getArtist(video);
    const title = getTitle(video);

    console.log(`Artist: ${artist}, Title: ${title}`);

    if (!artist || !title) continue;

    const search = await searchTrack(artist, title, accessToken);

    // Loop over the results and try to find the best match
    //--------------------------------------------------------------------------
    let bestMatch = "";
    let bestMatchScore = 0;

    for (const item of search.data.tracks.items) {
      let score = 0;

      if (
        item.artists
          .map((artist: any) => artist.name.toLowerCase())
          .includes(artist.toLowerCase())
      )
        score++;
      if (item.name.toLowerCase() === title.toLowerCase) score++;

      if (score > bestMatchScore) {
        bestMatch = item.id;
        bestMatchScore = score;
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

    if (!bestMatch) {
      await prisma.notFound.create({
        data: {
          artist,
          title,
          searchRequest: `${search.request.method} ${search.request.protocol}//${search.request.host}${search.request.path}`,
          video: {
            id: video.id,
            title: video.title,
            channelTitle: video.channelTitle,
            categoryId: video.categoryId,
          },
          platform: user.Platform.type,
        },
      });
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
