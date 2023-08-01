/*
| Developed by Fluid
| Filename : searchTrack.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import axios from "axios";
import querystring from "querystring";

// Search for the track on Spotify
//--------------------------------------------------------------------------

export async function searchTrack(
  artist: string,
  title: string,
  accessToken: string
) {
  const queryStringified = querystring.stringify({
    q: `artist:${artist} track:${title}`,
    // q: `${artist} ${title}`,
    type: "track",
    limit: 5,
  });

  return await axios.get(
    `https://api.spotify.com/v1/search?${queryStringified}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
