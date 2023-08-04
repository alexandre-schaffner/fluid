/*
| Developed by Fluid
| Filename : App.tsx
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import axios, { AxiosError } from "axios";
import { type Component, createSignal, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";

import { Divider } from "../../components/Divider/Divider";
import { Typography } from "../../components/Typography/Typography";
import { backendHost } from "../../constants.json";
import { type Me } from "../../contracts/Me.interface";
import { Header } from "./components/Header";
import { PlaylistCard } from "./components/PlaylistCard";
import { SyncCard } from "./components/SyncCard";
import { type PlaylistMetadata } from "../../contracts/PlaylistMetadata.interface";
import { TimerCard } from "./components/TimerCard";

/*
|--------------------------------------------------------------------------
| APP
|--------------------------------------------------------------------------
*/

const axiosInstance = axios.create({
  baseURL: backendHost,
  withCredentials: true,
});

const App: Component = () => {
  const [innerWidth, setInnerWidth] = createSignal<number>(window.innerWidth);
  const [me, setMe] = createStore<Me>({
    id: "",
    name: "",
    isSync: false,
    playlists: [],
    syncPlaylistId: null,
  });

  window.addEventListener("resize", () => setInnerWidth(window.innerWidth));

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  onMount(async () => {
    try {
      const response = await axiosInstance.get("/me");
      const me = response.data as Me;
      sortPlaylists(me.playlists);
      setMe(me);
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.status === 401)
        window.location.href = "/";
    }
  });

  const sortPlaylists = (playlists: PlaylistMetadata[]): void => {
    for (let i = 0; i < playlists.length; i++) {
      if (playlists[i].isSync) {
        playlists.unshift(playlists[i]);
        playlists.splice(i + 1, 1);
        break;
      }
    }
  };

  const toggleSyncPlaylist = (playlistId: string): void => {
    const updatedPlaylists = me.playlists.map((playlist) => {
      if (
        (playlist.id === playlistId || playlist.isSync) &&
        playlistId !== me.syncPlaylistId
      )
        return { ...playlist, isSync: !playlist.isSync };
      return playlist;
    });

    sortPlaylists(updatedPlaylists);

    setMe({
      ...me,
      playlists: updatedPlaylists,
      syncPlaylistId: playlistId,
    });
  };

  const toggleSyncStatus = async (): Promise<void> => {
    if (me.isSync) await axiosInstance.post("sync/status", { sync: false });
    else await axiosInstance.post("sync/status", { sync: true });
    setMe({ ...me, isSync: !me.isSync });
  };

  return (
    <div class="flex min-h-screen w-screen flex-wrap content-start items-start gap-4 bg-slate-950 bg-cover pb-2 pl-4 pr-4 pt-2 md:bg-cccircularRight2 md:bg-center md:pl-8 md:pr-8">
      <Show
        when={innerWidth() > 768}
        fallback={
          <div class="mb-4 flex basis-full flex-col gap-y-2">
            <Typography variation="title">Fluid</Typography>
            <Divider />
          </div>
        }
      >
        <>
          <Header />
          <div class="mb-6 basis-full">
            <Typography variation="title">Welcome, {me.name}</Typography>
          </div>
        </>
      </Show>

      <div class="flex flex-col gap-y-4">
        <SyncCard
          isSyncing={me.isSync}
          syncPlaylistId={me.syncPlaylistId}
          toggleSync={toggleSyncStatus}
        />

        <TimerCard />
      </div>

      <PlaylistCard
        playlists={me.playlists ?? []}
        isSyncing={me.isSync ?? false}
        setSync={toggleSyncPlaylist}
      />
    </div>
  );
};

export default App;
