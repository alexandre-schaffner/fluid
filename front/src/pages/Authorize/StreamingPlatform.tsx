/*
| Developed by Fluid
| Filename : StreamingPlatform.tsx
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { type JSXElement } from "solid-js";

import { Button } from "../../components/Button/Button";
import { Typography } from "../../components/Typography/Typography";
import { backendHost } from "../../constants.json";

const spotifyClientId = "6b99eeab69c44b28aa9187b60312acef";
const spotifyScopes =
  "user-read-private%20user-read-email%20playlist-modify-public%20playlist-modify-private";
const spotifyRedirectUri = `${backendHost}/spotify/webhook/authorize`;

export const AuthorizeStreamingPlatform = (): JSXElement => {
  return (
    <div
      class={
        "flex min-h-screen w-screen justify-center bg-slate-950 pl-8 pr-8 pt-20 lg:justify-between lg:bg-cccircularRight lg:bg-cover lg:pl-32 lg:pt-16"
      }
    >
      <div
        class={
          "relative flex flex-col gap-y-2 lg:static lg:max-w-xl lg:basis-full"
        }
      >
        <div>
          <Typography variation={"title"}>
            Don't worry, it's the last step
          </Typography>
        </div>
        <div class={"max-w-lg"}>
          <Typography>
            Fluid need access to your streaming platform in order to
            automatically manage your playlists.
          </Typography>
        </div>
        <div class="absolute bottom-16 w-full self-center lg:static lg:mt-8 lg:w-64 lg:self-start">
          <Button
            style="solid"
            label="Authorize Spotify"
            clickHandler={() =>
              (document.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${spotifyClientId}&scope=${spotifyScopes}&redirect_uri=${spotifyRedirectUri}`)
            }
          />
        </div>
      </div>
    </div>
  );
};
