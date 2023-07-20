import axios from "axios";
import { type Component } from "solid-js";

import { Typography } from "../../../components/Typography/Typography";

export const Playlist: Component<{
  name: string;
  image?: string;
  length: number;
  id: string;
}> = (props) => {
  const { name, image, length, id } = props;

  return (
    <div
      class={
        "flex w-full gap-4 rounded-md from-blue-800 to-blue-500 p-2 hover:cursor-pointer hover:bg-gradient-to-r"
      }
      onClick={async () => {
        await axios.post(
          "http://localhost:8000/platform/playlist/set",
          { playlistId: id },
          {
            withCredentials: true,
          },
        );
        document.location.href = '/app'
      }}
    >
      <img src={image ?? ""} class="w-16 rounded-sm" />
      <div>
        <Typography>{name}</Typography>
        <Typography variation="small">{length} Songs</Typography>
      </div>
    </div>
  );
};
