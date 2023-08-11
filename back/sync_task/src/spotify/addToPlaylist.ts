/*
| Developed by Fluid
| Filename : addToPlaylist.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import axios from "axios";

/*
|--------------------------------------------------------------------------
| Add a track to a playlist
|--------------------------------------------------------------------------
*/

export async function addToPlaylist(
  playlistId: string,
  trackId: string,
  accessToken: string,
  platform: "SPOTIFY" | "DEEZER"
) {
  switch (platform) {
    case "SPOTIFY":
      await axios.post(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          uris: [`spotify:track:${trackId}`],
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      break;

    case "DEEZER":
      await axios.post(
        `https://api.deezer.com/playlist/${playlistId}/tracks?songs=${trackId}&access_token=${accessToken}`
      );
      break;
  }
}
