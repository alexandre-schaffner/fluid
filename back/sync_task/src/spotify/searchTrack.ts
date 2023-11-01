/*
| Developed by Fluid
| Filename : searchTrack.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import axios from "axios";
import { Search } from "src/contracts/Search";

/*
|--------------------------------------------------------------------------
| Search for a track
|--------------------------------------------------------------------------
*/

export async function searchTrack(
  artist: string,
  title: string,
  accessToken: string,
  platform: "SPOTIFY" | "DEEZER"
): Promise<Search> {
  let res;

  switch (platform) {
    case "SPOTIFY":
      res = await axios.get(
        `https://api.spotify.com/v1/search?q=artist:${artist} track:${title}&type=track&limit=5`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      return {
        results: res.data.tracks.items.map((item: any) => ({
          uniqueRef: item.id,
          artists: item.artists.map((artist: any) => artist.name.toLowerCase()),
          title: item.name.toLowerCase(),
        })),
        searchRequest: `${res.request.method} ${res.request.protocol}//${res.request.host}${res.request.path}`,
      };

    case "DEEZER":
      res = await axios.get(
        `https://api.deezer.com/search?q=${artist} ${title}&limit=5`
      );

      return {
        results: res.data.data.map((item: any) => ({
          uniqueRef: item.id,
          artists: item.artist.name.toLowerCase(),
          title: item.title.toLowerCase(),
        })),
        searchRequest: `${res.request.method} ${res.request.protocol}//${res.request.host}${res.request.path}`,
      };
  }
}
