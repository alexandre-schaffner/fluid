import { Component } from "solid-js";
import styles from "./Playlist.module.css";
import { Typography } from "../../../components/Typography/Typography";

export const Playlist: Component<{
  name: string;
  image: string;
  length: number;
}> = (props) => {
  const { name, image, length } = props;

  return (
    <div class={styles.playlist}>
      <img src={image} alt={name} />
      <div class={styles.metadata}>
        <Typography>{name}</Typography>
        <Typography variation="small">{length} Songs</Typography>
      </div>
    </div>
  );
};
