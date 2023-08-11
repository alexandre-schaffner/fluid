/*
| Developed by Fluid
| Filename : StreamingPlatform.tsx
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { type JSXElement } from "solid-js";

import { Button } from "../../components/Button/Button";
import { Typography } from "../../components/Typography/Typography";
import { backendHost } from "../../constants.json";
import spotifyLogoUrl from "../../assets/spotify-logo.png";
import deezerLogoUrl from "../../assets/deezer-logo-mono-white.svg";

const spotifyClientId = "6b99eeab69c44b28aa9187b60312acef";
const spotifyScopes =
  "user-read-private%20user-read-email%20playlist-modify-public%20playlist-modify-private";
const spotifyRedirectUri = `${backendHost}/spotify/webhook/authorize`;

const deezerReirectUri = `${backendHost}/deezer/webhook/authorize`;
const deezerAppId = "626324";

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
            What streaming platform do you use ?
          </Typography>
        </div>
        <div class={"max-w-lg"}>
          <Typography>
            Fluid need access to your streaming platform in order to
            automatically manage your playlists.
          </Typography>
        </div>

        <div class="absolute bottom-16 flex h-min flex-col gap-4 lg:static lg:mt-8 lg:flex-row w-full">
          <div class="lg:w-64 h-20 lg:h-full">
            <Button
              style="solid"
              clickHandler={() =>
                (document.location.href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${spotifyClientId}&scope=${spotifyScopes}&redirect_uri=${spotifyRedirectUri}`)
              }
            >
              <img
                src={spotifyLogoUrl}
                alt="Spotify"
                class="mx-auto"
                style={"width: auto; height: 32px; !important"}
              />
            </Button>
          </div>

          <div class="lg:w-64 h-20 lg:h-full">
            <Button
              style="solid"
              clickHandler={() =>
                (document.location.href = `https://connect.deezer.com/oauth/auth.php?app_id=${deezerAppId}&redirect_uri=${deezerReirectUri}&perms=basic_access,email,offline_access,manage_library,manage_community,delete_library,listening_history`)
              }
            >
              <img
                src={deezerLogoUrl}
                alt="Deezer"
                class="mx-auto"
                style={"width:auto; height: 22px; !important"}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
