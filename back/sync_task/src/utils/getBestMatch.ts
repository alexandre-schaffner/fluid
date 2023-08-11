/*
| Developed by Fluid
| Filename : getBestMatch.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { Search } from "src/contracts/Search";

/*
|--------------------------------------------------------------------------
| Get best match
|--------------------------------------------------------------------------
*/

export const getBestMatch = (
  search: Search,
  artist: string,
  title: string
): string => {
  let bestMatch = "";
  let bestMatchScore = 0;

  // Loop over the results and try to find the best match
  //--------------------------------------------------------------------------
  for (const item of search.results) {
    let score = 0;

    if (item.artists.includes(artist.toLowerCase())) score++;
    if (item.title === title.toLowerCase()) score++;

    if (score > bestMatchScore) {
      bestMatch = String(item.uniqueRef);
      bestMatchScore = score;
    }
  }

  return bestMatch;
};
