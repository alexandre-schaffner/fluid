/*
| Developed by Fluid
| Filename : isInPlayliist.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import axios from "axios";

// Check if a track is already in a playlist
//--------------------------------------------------------------------------
export async function isInPlaylist(
  playlistId: string,
  trackId: string,
  accessToken: string,
  platform: "SPOTIFY" | "DEEZER"
) {
  if (platform === "DEEZER") return false;

  const response = await axios.get(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  for (const item of response.data.tracks.items) {
    if (item.track.id === trackId) return true;
  }

  return false;
}
