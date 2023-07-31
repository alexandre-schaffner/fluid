import { type PlaylistMetadata } from "./PlaylistMetadata.interface";

export interface Me {
  id: string;
  name: string;
  playlists: PlaylistMetadata[];
  isSync: boolean;
}
