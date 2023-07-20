/*
| Developed by Starton
| Filename : StreamingPlatform.tsx
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { type JSXElement } from 'solid-js';

import { Button } from '../../components/Button/Button';
import { Typography } from '../../components/Typography/Typography';

const spotifyClientId = "6b99eeab69c44b28aa9187b60312acef";
const spotifyScopes =
  "user-read-private%20user-read-email%20playlist-modify-public%20playlist-modify-private";
const spotifyRedirectUri = "http://localhost:8000/spotify/webhook/authorize";

export const AuthorizeStreamingPlatform = (): JSXElement => {
  return (
    <div
      class={"flex h-screen w-screen bg-slate-950 bg-cccircularRight bg-cover bg-left"}
    >
      <div class={"ml-32 mt-16 flex max-w-xl basis-1/2 flex-col gap-y-2"}>
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
        <div class="mt-8">
          <Button
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
