/*
| Developed by Fluid
| Filename : YouTube.tsx
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { useSearchParams } from "@solidjs/router";
import { type Component, createSignal } from "solid-js";

import { Button } from "../../components/Button/Button";
import { Typography } from "../../components/Typography/Typography";
import { backendHost } from "../../constants.json";

/*
|--------------------------------------------------------------------------
| LANDING PAGE
|--------------------------------------------------------------------------
*/

export const AuthorizeYouTube: Component = () => {
  // const menuItems = [{ name: "Fluid", link: "/" }];
  const [width, setWidth] = createSignal(window.screen.availWidth);
  const [searchParams, setSearchParams] = useSearchParams();

  window.addEventListener("resize", () => setWidth(window.screen.availWidth));

  const { user, state } = searchParams;

  const client = google.accounts.oauth2.initCodeClient({
    client_id:
      "205349973317-s5h03qvn3hlnjhoe52nu66aso811nlml.apps.googleusercontent.com",
    scope: "https://www.googleapis.com/auth/youtube.readonly",
    ux_mode: "redirect",
    redirect_uri: `${backendHost}/youtube/webhook/authorize`,
    state,
  });

  return (
    <div
      class={
        "flex h-screen w-screen justify-between bg-slate-950 bg-cccircularRight bg-cover"
      }
    >
      <div class={"ml-32 mt-16 flex max-w-xl basis-1/2 flex-col gap-y-2"}>
        <div>
          <Typography variation={"title"}>Welcome {user},</Typography>
        </div>
        <div class={"max-w-lg"}>
          <Typography>
            Fluid requires access to your YouTube account in order to track
            music you like.
          </Typography>
        </div>
        <div class="mt-8 w-64">
          <Button
            style="solid"
            label="Authorize YouTube"
            clickHandler={() => client.requestCode()}
          />
        </div>
      </div>
    </div>
  );
};

export default AuthorizeYouTube;
