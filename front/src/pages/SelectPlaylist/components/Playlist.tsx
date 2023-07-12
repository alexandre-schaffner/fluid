import { Component } from "solid-js";
import styles from "./Playlist.module.css";
import { Typography } from "../../../components/Typography/Typography";
import axios from "axios";

export const Playlist: Component<{
  name: string;
  image?: string;
  length: number;
  id: string;
}> = (props) => {
  const { name, image, length, id } = props;


  return (
    <div class={styles.playlist} onClick={async () => {
      await axios.post('http://localhost:8000/platform/playlist/set', { playlistId: id }, {
        withCredentials: true
        })
      // document.location.href = '/app'
    }}>
      <img src={image ? image : ''}/>
      <div class={styles.metadata}>
        <Typography>{name}</Typography>
        <Typography variation="small">{length} Songs</Typography>
      </div>
    </div>
  );
};
