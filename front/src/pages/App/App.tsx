/*
| Developed by Starton
| Filename : App.tsx
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import axios from "axios";
import { type Component, createSignal, onMount, Show } from "solid-js";

import { Button } from "../../components/Button/Button";
import { Divider } from "../../components/Divider/Divider";
import { Typography } from "../../components/Typography/Typography";
import { type Me } from "../../contracts/Me";
import { PlaylistCard } from "./components/PlaylistCard";
import { Header } from "./components/Header";

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
  const [me, setMe] = createSignal<Me | null>(null, { equals: false });

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  onMount(async () => {
    try {
      const response = await axiosInstance.get("/me");
      const me = response.data as Me;
      setMe(me);
    } catch (err: unknown) {
      console.error(err);
    }
  });

  return (
    <div class="flex h-screen w-screen flex-wrap content-start items-start gap-4 bg-slate-950 bg-cccircularRight2 bg-cover bg-center pl-8 pt-2">
      <Header />
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
            style={((me()?.isSync) === true) ? "outline" : 'solid'}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            clickHandler={async () => {
              if (me()?.isSync ?? false)
                await axios.delete("http://localhost:8000/platform/sync", {});
              else await axios.post("http://localhost:8000/platform/sync", {});
              setMe((prev) => {
                if (prev === null) return null;
                
                prev.isSync = !prev.isSync;

                return prev;
              });
            }}
          >
            <Show when={me()?.isSync} fallback={<Typography>Sync</Typography>}>
              <Typography>Unsync</Typography>
            </Show>
          </Button>
        </div>
      </div>

      <PlaylistCard
        playlists={me()?.playlists ?? []}
        isSyncing={me()?.isSync ?? false}
      />
    </div>
  );
};

export default App;
