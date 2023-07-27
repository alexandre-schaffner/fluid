/*
| Developed by Starton
| Filename : App.tsx
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import axios from 'axios';
import { type Component, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

import { Typography } from '../../components/Typography/Typography';
import { backendHost } from '../../constants.json';
import { type Me } from '../../contracts/Me';
import { Header } from './components/Header';
import { PlaylistCard } from './components/PlaylistCard';
import { SyncCard } from './components/SyncCard';

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
  // const [me, setMe] = createSignal<Me | null>(null, { equals: false });
  const [me, setMe] = createStore<Me>({
    id: "",
    name: "",
    isSync: false,
    playlists: [],
  });

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

  const toggleSyncPlaylist = (playlistId: string): void => {
    setMe({
      ...me,
      playlists: me.playlists.map((playlist) => {
        if (playlist.id === playlistId || playlist.isSync)
          return { ...playlist, isSync: !playlist.isSync };
        return playlist;
      }),
    });
  };

  const toggleSyncStatus = async (): Promise<void> => {
    if (me.isSync ?? false)
      await axiosInstance.delete("platform/sync", {});
    else await axiosInstance.post("/platform/sync", {});
    setMe({ ...me, isSync: !me.isSync });
  };

  return (
    <div class="flex h-screen max-h-screen w-screen flex-wrap content-start items-start gap-4 bg-slate-950 bg-cccircularRight2 bg-cover bg-center pl-8 pt-2">
      <Header />
      <div class="mb-6 basis-full">
        <Typography variation="title">Welcome, {me.name}</Typography>
      </div>

      {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
      <SyncCard isSyncing={me.isSync} toggleSync={toggleSyncStatus} />

      <PlaylistCard
        playlists={me.playlists ?? []}
        isSyncing={me.isSync ?? false}
        setSync={toggleSyncPlaylist}
      />
    </div>
  );
};

export default App;
