/*
| Developed by Starton
| Filename : refreshToken.ts
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import axios from "axios";
import querystring from "querystring";

/*
|--------------------------------------------------------------------------
| Refresh Spotify access token
|--------------------------------------------------------------------------
*/

// Get encoded credentials
//--------------------------------------------------------------------------
const encodedCredentials = Buffer.from(
  `${process.env["SPOTIFY_CLIENT_ID"]}:${process.env["SPOTIFY_CLIENT_SECRET"]}`
).toString("base64");

// Use the refresh token to get a new access token
//--------------------------------------------------------------------------
export async function refreshAccessToken(refreshToken: string) {
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    querystring.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const accessToken = response.data.access_token;

  return accessToken;
}
