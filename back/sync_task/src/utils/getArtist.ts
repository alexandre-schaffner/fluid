import { Video } from "../contracts/Video";

export const getArtist = (video: Video): string | null => {
  let artist: string | undefined;

  if (video.title.includes(" - ")) artist = video.title.split(" - ")[0]?.trim();
  else if (video.title.includes(" | "))
    artist = video.title.split(" | ")[0]?.trim();
  else if (video.categoryId === "10") {
    artist = video.channelTitle;
    if (artist.includes(" - ")) artist = artist.split(" - ")[0]?.trim();
  }

  if (!artist) return null;

  const regex = /( (\(.*|ft.*|feat.*|x.*)|,.*| &.*)/gi;
  artist = artist.replace(regex, "");

  return artist;
};
