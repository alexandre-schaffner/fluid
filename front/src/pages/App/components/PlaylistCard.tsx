/*
| Developed by Starton
| Filename : PlaylistCard.tsx
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { type Component, For, splitProps } from 'solid-js';

import { Button } from '../../../components/Button/Button';
import { CardHeader } from '../../../components/Card/CardHeader';
import { Divider } from '../../../components/Divider/Divider';
import { type PlaylistMetadata } from '../../../contracts/PlaylistMetadata';
import { Playlist } from '../../../components/Playlist/Playlist';

/*
|--------------------------------------------------------------------------
| Select playlist card
|--------------------------------------------------------------------------
*/

interface PlaylistCardProps {
  playlists: PlaylistMetadata[];
  isSyncing: boolean;
  setSync: (playlistId: string) => void;
}

export const PlaylistCard: Component<PlaylistCardProps> = (props) => {
  const [local, others] = splitProps(props, ['playlists', 'isSyncing']);

  return (
    <div class="flex max-w-xl flex-col gap-y-2 rounded-xl bg-slate-900 p-4">
      <CardHeader
        title="Playlist"
        description="Fluid automatically saves music you like on YouTube to this playlist."
      />

      <div class="flex max-h-96 flex-col overflow-y-scroll no-scrollbar">
      <For each={local.playlists}>
        {(playlist) => (
          <Playlist
            id={playlist.id}
            length={playlist.length}
            name={playlist.name}
            image={playlist.image}
            isSyncedPlaylist={playlist.isSync}
            isSyncing={local.isSyncing}
            toggleSync={others.setSync}
          />
        )}
      </For>
      </div>
      <Divider />

      <div class="mt-2 flex w-64 flex-col self-end">
        <Button
          style='solid'
          label="New playlist"
          clickHandler={() => {
            console.log('Pop the "Create a new playlist" modal');
          }}
        />
      </div>
    </div>
  );
};
