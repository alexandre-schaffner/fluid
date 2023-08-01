import { type Component, Show, splitProps } from "solid-js";

import { Button } from "../../../components/Button/Button";
import { CardHeader } from "../../../components/Card/CardHeader";
import { Typography } from "../../../components/Typography/Typography";

interface SyncCardProps {
  isSyncing: boolean;
  syncPlaylistId: string | null;
  toggleSync: () => Promise<void>;
}

export const SyncCard: Component<SyncCardProps> = (props) => {
  const [local, others] = splitProps(props, ["isSyncing", 'syncPlaylistId', "isSyncing", "toggleSync"]);

  return (
    <div class="flex max-w-xs flex-col gap-y-2 rounded-xl bg-slate-900 p-4">
      <CardHeader
        title="Sync"
        description={(local.syncPlaylistId !== null) ? "Sync your YouTube and Spotify accounts with Fluid." : "Select a playlist to be able to use Fluid."}
      />
      <div class="flex basis-full justify-start">
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
