import { PlaylistMetadata } from './PlaylistMetadata';

export interface MeDto {
  id: string;
  name: string;
  playlists: PlaylistMetadata[];
  isSync: boolean;
  syncPlaylistId: string | null;
}
