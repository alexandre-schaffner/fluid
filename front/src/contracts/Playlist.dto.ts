import { type TrackDto } from "./Track.dto";

export interface PlaylistDto {
  id: string;
  name: string;
  image?: string;
  length: number;
  tracks: TrackDto[];
  href: string;
  isSync: boolean;
}
