import { youtube_v3 } from 'googleapis';

export const getTitle = (snippet: youtube_v3.Schema$VideoSnippet) => {
  let title = null;

  if (snippet.title!.includes(' - '))
    title = snippet.title!.split(' - ')[1].trim();
  else if (snippet.title!.includes(' | '))
    title = snippet.title!.split(' | ')[1].trim();
  else if (snippet.categoryId === '10') title = snippet.title;

  if (title) {
    const regex = /( (\(.*|ft.*|feat.*|x.*)|,.*)/gi;
    title = title.replace(regex, '');
  }

  return title;
};
