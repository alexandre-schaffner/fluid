/*
| Developed by Starton
| Filename : SelectPlaylist.tsx
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import axios from 'axios';
import { Component, createSignal, For, onMount } from 'solid-js';

import { Divider } from '../../components/Divider/Divider';
import { Header } from '../../components/Header/Header';
import { PageContainer } from '../../components/PageContainer/PageContainer';
import { Typography } from '../../components/Typography/Typography';
import { PlaylistMetadata } from '../../contracts/PlaylistMetadata';
import { Playlist } from './components/Playlist';
import styles from './SelectPlaylist.module.css';

axios.defaults.withCredentials = true;

export const SelectPlaylist: Component = () => {
  const menuItems = [{ name: "Fluid", link: "/" }];

  const [playlists, setPlaylists] = createSignal<PlaylistMetadata[]>([]);

  onMount(async () => {
    const res = await axios.get("http://localhost:8000/platform/playlists", {
      withCredentials: true
    });
    setPlaylists(res.data.playlists);
  })

  return (
    <PageContainer>
      <Header items={menuItems} />
      <div class={styles.body}>
        <div class={styles.leftSide}>
          <div class={styles.title}>
            <Typography variation={"title"}>Choose a playlist</Typography>
            <Typography variation={"subtitle"}>
              Your music discoveries will be added to this playlist.
            </Typography>
          </div>
        </div>
        <div class={styles.rightSide}>
          <div class={styles.playlistsContainer}>
            <Typography>Your playlists</Typography>
            <Divider />
            <For each={playlists()}>
              {(playlist) => (
                <Playlist
                  name={playlist.name}
                  image={playlist.image}
                  length={playlist.length}
                />
              )}
            </For>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
