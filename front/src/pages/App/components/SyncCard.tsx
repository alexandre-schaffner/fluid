/*
| Developed by Fluid
| Filename : SyncCard.tsx
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { type Component, Show, splitProps } from "solid-js";

import { Button } from "../../../components/Button/Button";
import { CardHeader } from "../../../components/Card/CardHeader";
import { Typography } from "../../../components/Typography/Typography";

interface SyncCardProps {
  isSyncing: boolean;
  syncPlaylistId: string | null;
  toggleSync: () => Promise<void>;
}

/*
|--------------------------------------------------------------------------
| Sync card
|--------------------------------------------------------------------------
*/

export const SyncCard: Component<SyncCardProps> = (props) => {
  const [local] = splitProps(props, [
    "isSyncing",
    "syncPlaylistId",
    "isSyncing",
    "toggleSync",
  ]);

  return (
    <div class="flex flex-col gap-y-2 rounded-xl border border-slate-700 bg-slate-900 p-4">
      <CardHeader
        title="Status"
        description={
          local.syncPlaylistId !== null
            ? "Sync your YouTube and Spotify accounts with Fluid."
            : "Select a playlist to be able to use Fluid."
        }
      />
      <div class="flex max-h-fit basis-full justify-start">
        <Button
          isDisabled={local.syncPlaylistId === null}
          style={local.isSyncing ? "outline" : "solid"}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          clickHandler={local.toggleSync}
        >
          <Show when={local.isSyncing} fallback={<Typography>Sync</Typography>}>
            <Typography>Unsync</Typography>
          </Show>
        </Button>
      </div>
    </div>
  );
};
