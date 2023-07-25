import { type Component, Show, splitProps } from "solid-js";

import { Button } from "../../../components/Button/Button";
import { CardHeader } from "../../../components/Card/CardHeader";
import { Typography } from "../../../components/Typography/Typography";

interface SyncCardProps {
  isSyncing: boolean;
  toggleSync: () => Promise<void>;
}

export const SyncCard: Component<SyncCardProps> = (props) => {
  const [local, others] = splitProps(props, ["isSyncing", "isSyncing"]);

  return (
    <div class="flex max-w-xs flex-col gap-y-2 rounded-xl bg-slate-900 p-4">
      <CardHeader
        title="Sync"
        description="Sync your YouTube account with Fluid."
      />
      <div class="flex basis-full justify-start">
        <Button
          style={local.isSyncing ? "outline" : "solid"}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          clickHandler={others.toggleSync}
        >
          <Show when={local.isSyncing} fallback={<Typography>Sync</Typography>}>
            <Typography>Unsync</Typography>
          </Show>
        </Button>
      </div>
    </div>
  );
};
