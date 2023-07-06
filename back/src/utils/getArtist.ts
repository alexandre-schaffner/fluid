import { youtube_v3 } from 'googleapis';

export const getArtist = (
  snippet: youtube_v3.Schema$VideoSnippet,
): string | null => {
  let artist = null;

  if (snippet.title!.includes(' - '))
    artist = snippet.title!.split(' - ')[0].trim();
  else if (snippet.title!.includes(' | '))
    artist = snippet.title!.split(' | ')[0].trim();
  else if (snippet.categoryId === '10') {
    artist = snippet.channelTitle!;
    if (artist.includes(' - ')) artist = artist.split(' - ')[0].trim();
  }

  if (artist) {
    const regex = /( (\(.*|ft.*|feat.*|x.*)|,.*)/gi;
    artist = artist.replace(regex, '');
  }

  return artist;
};
