import { Component, For } from "solid-js";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import { Header } from "../../components/Header/Header";
import styles from "./SelectPlaylist.module.css";
import { Typography, Variant } from "../../components/Typography/Typography";
import { Playlist } from "./components/Playlist";
import { Divider } from "../../components/Divider/Divider";

export const SelectPlaylist: Component = () => {
  const menuItems = [{ name: "Fluid", link: "/" }];

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
            <Playlist
              name="Liked Songs"
              image="https://i1.sndcdn.com/artworks-y6qitUuZoS6y8LQo-5s2pPA-t500x500.jpg"
              length={42}
            />
            <Playlist
              name="Playlist #1"
              image="https://i1.sndcdn.com/artworks-y6qitUuZoS6y8LQo-5s2pPA-t500x500.jpg"
              length={42}
            />
            <Playlist
              name="Playlist #2"
              image="https://i1.sndcdn.com/artworks-y6qitUuZoS6y8LQo-5s2pPA-t500x500.jpg"
              length={42}
            />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
