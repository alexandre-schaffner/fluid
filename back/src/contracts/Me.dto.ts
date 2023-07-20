import { PlaylistMetadata } from './PlaylistMetadata';

export interface MeDto {
  id: string;
  name: string;
  playlist: PlaylistMetadata[];
  isSync: boolean;
}
