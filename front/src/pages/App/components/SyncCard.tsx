import { type Component } from 'solid-js';

import { Button } from '../../../components/Button/Button';
import { CardHeader } from '../../../components/Card/CardHeader';
import { Typography } from '../../../components/Typography/Typography';
import axios from 'axios';
import { createSignal, Show } from 'solid-js';

interface SyncCardProps {
    isSyncing: boolean;
}

export const SyncCard: Component<SyncCardProps> = (props) => {
  const [isSync, setIsSync] = createSignal<boolean>(props.isSyncing);

  return (
    <div class="flex max-w-xs flex-col gap-y-2 rounded-xl bg-slate-900 p-4">
    <CardHeader title="Status"  description="Sync your YouTube account with Fluid."/>
      <div class="flex basis-full justify-start">
        <Button
          style={isSync() ? "outline" : "solid"}
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          clickHandler={async () => {
            if (isSync())
              await axios.delete("http://localhost:8000/platform/sync", {});
            else await axios.post("http://localhost:8000/platform/sync", {});
            setIsSync(!isSync());
          }}
        >
          <Show when={isSync()} fallback={<Typography>Sync</Typography>}>
            <Typography>Unsync</Typography>
          </Show>
        </Button>
      </div>
    </div>
  );
};
