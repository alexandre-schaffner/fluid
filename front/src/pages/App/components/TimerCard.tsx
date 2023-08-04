/*
| Developed by Fluid
| Filename : SyncCard.tsx
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { type Component } from "solid-js";

import { CardHeader } from "../../../components/Card/CardHeader";
import { Typography } from "../../../components/Typography/Typography";
import { createSignal } from "solid-js";
import { Divider } from "../../../components/Divider/Divider";

/*
|--------------------------------------------------------------------------
| Sync card
|--------------------------------------------------------------------------
*/

export const TimerCard: Component = () => {
  const [seconds, setSeconds] = createSignal<number>(
    60 - new Date().getSeconds(),
  );

  setInterval(() => {
    seconds() === 0 ? setSeconds(60) : setSeconds(seconds() - 1);
  }, 1000);

  return (
    <div class="flex basis-full flex-col gap-y-2 rounded-xl border border-slate-700 bg-slate-900 p-4 md:max-w-sm">
      <div class="mb-2 flex flex-col gap-y-4">
        <Typography variation="cardTitle">Next sync in</Typography>
        <Divider />
      </div>
      <div class="flex max-h-fit basis-full flex-col">
        <div
          class={
            "font-sans text-7xl/tight font-medium text-blue-200 subpixel-antialiased"
          }
        >
          {seconds()}
        </div>
        <div
          class={
            "font-sans text-5xl/tight font-normal text-slate-600 subpixel-antialiased"
          }
        >
          seconds
        </div>
      </div>
    </div>
  );
};
