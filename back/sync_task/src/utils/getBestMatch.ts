/*
| Developed by Fluid
| Filename : getBestMatch.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

/*
|--------------------------------------------------------------------------
| Get best match
|--------------------------------------------------------------------------
*/

export const getBestMatch = (
  search: any,
  artist: string,
  title: string
): string => {
  let bestMatch = "";
  let bestMatchScore = 0;

  // Loop over the results and try to find the best match
  //--------------------------------------------------------------------------
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

  return bestMatch;
};
