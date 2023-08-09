import { Video } from "../contracts/Video";

export const getTitle = (video: Video) => {
  let title = null;

  if (video.title!.includes(" - "))
    title = video.title!.split(" - ")[1]?.trim();
  else if (video.title!.includes(" | "))
    title = video.title!.split(" | ")[1]?.trim();
  else if (video.categoryId === "10") title = video.title;

  if (title) {
    title = title.replace(/#shorts?/, "");

    const regex = /( (\(.*|\|.*|ft.*|feat.*|x.*|\[.*))/gi;
    title = title.replace(regex, "");
  }

  return title === "" ? null : title;
};
