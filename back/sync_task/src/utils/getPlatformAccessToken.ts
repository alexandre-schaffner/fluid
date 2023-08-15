/*
| Developed by Fluid
| Filename : getPlatformAccessToken.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { Platform, User } from "@prisma/client";
import { refreshAccessToken } from "../spotify/refreshToken";

export const getPlatformAccessToken = async (
  user: User & { platform: Platform }
) => {
  let accessToken: string;

  switch (user.platform.type) {
    // Get Spotify access token
    //--------------------------------------------------------------------------
    case "SPOTIFY":
      accessToken = await refreshAccessToken(user.platform.refreshToken);
      break;

    // Get Deezer access token
    //--------------------------------------------------------------------------
    case "DEEZER":
      accessToken = user.platform.refreshToken;
      break;

    default:
      throw new Error(
        `Cannot sync ${user.id}: the user has an invalid platform.`
      );
  }

  return accessToken;
};
