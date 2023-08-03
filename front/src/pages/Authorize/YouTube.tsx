/*
| Developed by Fluid
| Filename : YouTube.tsx
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { useSearchParams } from "@solidjs/router";
import { type Component } from "solid-js";

import { Button } from "../../components/Button/Button";
import { Typography } from "../../components/Typography/Typography";
import { backendHost } from "../../constants.json";

/*
|--------------------------------------------------------------------------
| LANDING PAGE
|--------------------------------------------------------------------------
*/

export const AuthorizeYouTube: Component = () => {
  const [searchParams, setSearchParams] = useSearchParams();

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
        "flex min-h-screen w-screen justify-center bg-slate-950 lg:bg-cover lg:justify-between lg:bg-cccircularRight pl-8 pr-8 pt-20 lg:pl-32 lg:pt-16"
      }
    >
      <div
        class={
          "relative flex flex-col gap-y-2 lg:static lg:max-w-xl lg:basis-full"
        }
      >
        <div>
          <Typography variation={"title"}>Welcome {user},</Typography>
        </div>
        <div class={"max-w-lg"}>
          <Typography>
            Fluid requires access to your YouTube account in order to track
            music you like.
          </Typography>
        </div>
        <div class="absolute bottom-16 w-full self-center lg:static lg:mt-8 lg:w-64 lg:self-start">
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
