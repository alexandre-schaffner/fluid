import axios from "axios";
import { type Component, createSignal, onMount, For, Show } from "solid-js";

import { Button } from "../../components/Button/Button";
import { Divider } from "../../components/Divider/Divider";
import { Typography } from "../../components/Typography/Typography";
import { type MeDto } from "../../contracts/Me.dto";
import { Playlist } from "../SelectPlaylist/components/Playlist";

/*
| Developed by Starton
| Filename : App.tsx
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

/*
|--------------------------------------------------------------------------
| APP
|--------------------------------------------------------------------------
*/

const backendHost = "http://localhost:8000";
const axiosInstance = axios.create({
  baseURL: backendHost,
  withCredentials: true,
});

const App: Component = () => {
  const [me, setMe] = createSignal<MeDto | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  onMount(async () => {
    try {
      const response = await axiosInstance.get("/me");
      const me = response.data as MeDto;
      setMe(me);
    } catch (err: unknown) {
      console.error(err);
    }
  });

  return (
    <div class="flex h-screen w-screen flex-wrap content-start items-start gap-4 bg-slate-950 bg-cccircularRight2 bg-cover bg-center pl-8 pt-2">
      <div class="flex w-full flex-col">
        <div class="mb-2 flex max-w-4xl items-baseline gap-x-8 border-b pb-2">
          <Typography variation="title">Fluid</Typography>
          <Typography variation="subtitle">Homepage</Typography>
        </div>
        <div class="basis-1"></div>
        {/* <Divider /> */}
      </div>

      <div class="mb-6 basis-full">
        <Typography variation="title">Welcome, {me()?.name}</Typography>
      </div>

      <div class="flex max-w-xs flex-col gap-y-2 rounded-xl bg-slate-900 p-4">
        <div class="mb-4 flex flex-col gap-y-2">
          <Typography variation="cardTitle">Status</Typography>

          <Typography>Sync your YouTube account with Fluid.</Typography>
          <Divider />
        </div>
        <div class="flex basis-full justify-start">
          <Button
            label={me()?.isSync === true ? "Sync" : "Unsync"}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            clickHandler={async () => {
              if ((me()?.isSync) ?? false)
                  await axios.delete("http://localhost:8000/platform/sync", {});
                else
                 await axios.post("http://localhost:8000/platform/sync", {})

              setMe((prev) => {
                const me = prev;

                if (me === null) return null;

                if (me.isSync) me.isSync = false;
                else me.isSync = true;

                console.log(me);
                return me;
              });
            }}
          />
        </div>
      </div>

      <div class="flex max-w-xl flex-col gap-y-2 rounded-xl bg-slate-900 p-4">
        <div class="mb-4 flex flex-col gap-y-2">
          <Typography variation="cardTitle">Playlist</Typography>
          <Typography>
            Fluid automatically saves music you like on YouTube to this
            playlist.
          </Typography>
          <Divider />
        </div>
        <For each={me()?.playlist}>
          {(playlist) => (
            <Playlist
              id={playlist.id}
              length={playlist.length}
              name={playlist.name}
              image={playlist.image}
            />
          )}
        </For>

        <div class="flex basis-full justify-end"></div>
      </div>
    </div>
  );
};

export default App;
