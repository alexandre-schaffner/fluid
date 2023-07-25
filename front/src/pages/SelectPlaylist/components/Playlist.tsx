/*
| Developed by Starton
| Filename : Playlist.tsx
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import axios, { type AxiosInstance } from "axios";
import { type Component, Show, splitProps } from "solid-js";

import { Typography } from "../../../components/Typography/Typography";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
});

/*
|--------------------------------------------------------------------------
| Playlist item
|--------------------------------------------------------------------------
*/

export const Playlist: Component<{
  name: string;
  image?: string;
  length: number;
  id: string;
  isSync?: boolean;
}> = (props) => {
  const [local, others] = splitProps(props, [
    "name",
    "image",
    "length",
    "id",
    "isSync",
  ]);

  // Set the playlist to sync
  // --------------------------------------------------------------------------
  const setPlaylist = async (playlistId: string): Promise<void> => {
    await axiosInstance.post("/platform/playlist/set", { playlistId });
  };

  return (
    <div
      class={
        "flex w-full gap-4 rounded-md from-blue-800 to-blue-500 p-2 hover:cursor-pointer hover:bg-gradient-to-r"
      }
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={async () => {
        await setPlaylist(local.id);
      }}
    >
      <img src={local.image ?? ""} class="w-16 rounded-sm" />

      <div class="w-1/2 flex-col">
        <Typography>{local.name}</Typography>
        <Typography variation="small">{local.length} Songs</Typography>
      </div>

      <Show when={local.isSync}>
        <div class="flex items-center gap-x-2">
          <div class="h-2 w-2 rounded-full bg-green-400" />
          <Typography variation="small">syncing</Typography>
        </div>
      </Show>
    </div>
  );
};
