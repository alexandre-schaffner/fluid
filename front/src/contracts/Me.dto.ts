import { type PlaylistDto } from "./Playlist.dto";

export interface MeDto {
  id: string;
  name: string;
  playlist: PlaylistDto[];
  isSync: boolean;
}
