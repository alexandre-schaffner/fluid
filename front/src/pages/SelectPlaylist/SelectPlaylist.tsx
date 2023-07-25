/*
| Developed by Starton
| Filename : SelectPlaylist.tsx
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import axios from "axios";
import { type Component, createSignal, onMount, For } from "solid-js";

import { Typography } from "../../components/Typography/Typography";
import { type PlaylistMetadata } from "../../contracts/PlaylistMetadata";
import { Playlist } from "../../components/Playlist/Playlist";
import { Divider } from "../../components/Divider/Divider";

axios.defaults.withCredentials = true;

export const SelectPlaylist: Component = () => {
  const [playlists, setPlaylists] = createSignal<PlaylistMetadata[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  onMount(async () => {
    const res = await axios.get("http://localhost:8000/platform/playlists", {
      withCredentials: true,
    });
    setPlaylists(res.data.playlists);
  });

  return (
    <div
      class={
        "flex h-screen w-screen content-start justify-center bg-slate-950 bg-cccircularCenter bg-cover bg-no-repeat bg-center"
      }
    >
      <div
        class={
          "flex mt-64 h-fit w-full max-w-xl flex-col gap-y-2 rounded-xl bg-slate-900 p-4 border border-slate-800 shadow-md"
        }
      >
        <div class={"flex flex-col gap-y-4 mb-2"}>
          <div class="flex flex-col gap-y-2">
          <Typography variation="cardTitle">Choose a playlist</Typography>
          <Typography>
            Fluid will automatically save musics you like on YouTube to this playlist.
          </Typography>
          </div>
          <Divider />
        </div>
        <For each={playlists()}>
          {(playlist) => (
            <Playlist
              name={playlist.name}
              image={playlist.image}
              length={playlist.length}
              id={playlist.id}
            />
          )}
        </For>
      </div>
    </div>
  );
};
