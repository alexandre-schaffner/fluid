import { type PlaylistMetadata } from "./PlaylistMetadata";

export interface Me {
  id: string;
  name: string;
  playlists: PlaylistMetadata[];
  isSync: boolean;
}
