/*
| Developed by Fluid
| Filename : searchTrack.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import axios from "axios";

/*
|--------------------------------------------------------------------------
| Search for a track on Spotify
|--------------------------------------------------------------------------
*/

export async function searchTrack(
  artist: string,
  title: string,
  accessToken: string
) {
  return await axios.get(
    `https://api.spotify.com/v1/search?q=artist:${artist} track:${title}&type=track&limit=5`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
