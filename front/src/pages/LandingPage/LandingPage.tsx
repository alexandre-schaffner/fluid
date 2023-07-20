/*
| Developed by Starton
| Filename : LandingPage.tsx
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { type Component, createEffect, createSignal } from 'solid-js';

import { SignInWithGoogle } from '../../components/SignInWithGoogle/SignInWithGoogle';
import { Typography } from '../../components/Typography/Typography';


/*
|--------------------------------------------------------------------------
| LANDING PAGE
|--------------------------------------------------------------------------
*/

export const Landing: Component = () => {
  const ogWindowSize = window.screen.availWidth;

  const [width, setWidth] = createSignal(ogWindowSize);

  window.addEventListener("resize", () => setWidth(window.screen.availWidth));

  createEffect(() => {
    if (width() <= 992 && ogWindowSize > 992) location.reload();
    if (width() > 992 && ogWindowSize <= 992) location.reload();
  });

  return (
    <div
      class={
        "flex h-screen flex-col items-center justify-start bg-slate-900 bg-cccircularTop bg-cover bg-center"
      }
    >
      <div class={"flex flex-col mt-8 max-w-xl text-center gap-y-4"}>
        <Typography variation="title">Fluid</Typography>
        <Typography variation="subtitle">
          Discover on YouTube, enjoy on Spotify.
        </Typography>
      </div>

      <div class={"fixed flex flex-col h-full justify-center w-full max-w-sm text-center gap-6 items-center"}>
        {/* <Typography>
          Fluid automatically saves your YouTube music discoveries to a
          Spotify playlist of your choice.
        </Typography> */}
        <SignInWithGoogle />
      </div>
    </div>
  );
};

export default Landing;
