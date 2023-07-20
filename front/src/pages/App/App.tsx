/*
| Developed by Starton
| Filename : App.tsx
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import type { Component } from "solid-js";

import axios from "axios";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import { Header } from "../../components/Header/Header";
import { Button } from "../../components/Button/Button";
import { Typography } from "../../components/Typography/Typography";
import { Divider } from "../../components/Divider/Divider";

/*
|--------------------------------------------------------------------------
| APP
|--------------------------------------------------------------------------
*/

const App: Component = () => {
  return (
    <div class="flex h-screen w-screen flex-wrap content-start gap-4 bg-slate-950 p-8 bg-cccircularRight2 bg-cover bg-center">
      <div class="flex w-full flex-col">
        <div class="mb-4 flex basis-full items-baseline gap-x-4">
          <Typography variation="title">Fluid</Typography>
          <Typography variation="subtitle">Homepage</Typography>
        </div>
        {/* <Divider /> */}
      </div>

      <div class="mb-4 mt-4 basis-full">
        <Typography variation="title">Welcome, Alexandre</Typography>
      </div>

      <div class="flex flex-col gap-y-2 rounded-xl bg-slate-900 p-4 max-w-xs">
        <div class="mb-4 flex flex-col gap-y-2">
          <Typography variation="cardTitle">Sync</Typography>
          <Typography>Sync your YouTube account with Fluid.</Typography>
          <Divider />
        </div>
        <div class="flex justify-center basis-full">
          <Button
            label="Sync"
            clickHandler={async () => {
              await axios.post(
                "http://localhost:8000/platform/sync",
                {},
                {
                  withCredentials: true,
                },
              );
            }}
          />
        </div>
      </div>

      <div class="flex flex-col gap-y-2 rounded-xl bg-slate-900 p-4 max-w-xl">
        <div class="mb-4 flex flex-col gap-y-2">
          <Typography variation="cardTitle">Playlist</Typography>
          <Typography>Fluid automatically saves music you like on YouTube to this playlist.</Typography>
          <Divider />
        </div>
        <div class="flex justify-end basis-full">
          <Button
            label="Set playlist"
            clickHandler={() => {
              console.log("Set playlist");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
