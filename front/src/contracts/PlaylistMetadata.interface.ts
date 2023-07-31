import { type TrackMetadata } from "./TrackMetadata.interface";

export interface PlaylistMetadata {
  id: string;
  name: string;
  image?: string;
  length: number;
  tracks: TrackMetadata[];
  href: string;
  isSync: boolean;
}
