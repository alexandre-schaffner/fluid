/*
| Developed by Starton
| Filename : Playlist.tsx
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import axios from "axios";
import { type Component, Show, splitProps } from "solid-js";

import { Typography } from "../Typography/Typography";

const backendHost = process.env.BACKEND_HOST || "https://fluid-ts522vy4bq-od.a.run.app";
const axiosInstance = axios.create({
  baseURL: backendHost,
  withCredentials: true,
});

/*
|--------------------------------------------------------------------------
| Playlist item
|--------------------------------------------------------------------------
*/

// Props
// --------------------------------------------------------------------------
interface PlaylistProps {
  name: string;
  image?: string;
  length: number;
  id: string;
  isSyncedPlaylist: boolean;
  isSyncing: boolean;
  toggleSync: (playlistId: string) => void;
};

// Component
// --------------------------------------------------------------------------
export const Playlist: Component<PlaylistProps> = (props) => {
  const [local, others] = splitProps(props, [
    "name",
    "image",
    "length",
    "id",
    "isSyncedPlaylist",
    "isSyncing",
  ]);

  // Set the playlist to sync
  // --------------------------------------------------------------------------
  const setPlaylist = async (playlistId: string): Promise<void> => {
    await axiosInstance.post("/platform/playlist/set", { playlistId });
    others.toggleSync(playlistId);
  };

  // Display when the playlist is syncing
  // --------------------------------------------------------------------------
  const SyncingLabel: Component = () => {
    return (
      <div class="flex items-center gap-x-2">
        <div
          class="h-2 w-2 rounded-full bg-green-400"
          classList={{ "bg-orange-400": !local.isSyncing }}
        />
        <Typography variation="small">syncing</Typography>
      </div>
    );
  };

  // Display when the syncing is paused
  // --------------------------------------------------------------------------
  const SyncPaused: Component = () => {
    return (
      <div class="flex items-center gap-x-2">
        <div class="h-2 w-2 rounded-full bg-orange-400" />
        <Typography variation="small">sync paused</Typography>
      </div>
    );
  };

  // Component
  // --------------------------------------------------------------------------
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

      <Show when={local.isSyncedPlaylist}>
        <Show when={local.isSyncing} fallback={<SyncPaused />}>
          <SyncingLabel />
        </Show>
      </Show>
    </div>
  );
};
