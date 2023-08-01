/*
| Developed by Fluid
| Filename : Playlist.tsx
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import axios from 'axios';
import { type Component, Show, splitProps } from 'solid-js';

import { backendHost } from '../../constants.json';
import { Typography } from '../Typography/Typography';

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
        "flex w-full visible gap-4 rounded-md p-2 hover:cursor-pointer hover:bg-gradient-to-r"
      }
      classList={{
        "bg-slate-800": local.isSyncedPlaylist,
        "border-2": local.isSyncedPlaylist,
        "border-green-500": local.isSyncedPlaylist && local.isSyncing,
        "border-orange-500": local.isSyncedPlaylist && !local.isSyncing,
        "from-blue-800 to-blue-500": !local.isSyncedPlaylist,
        "from-green-900 to-green-600": local.isSyncedPlaylist,
        "from-orange-900 to-orange-600": local.isSyncedPlaylist && !local.isSyncing,
      }}
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
