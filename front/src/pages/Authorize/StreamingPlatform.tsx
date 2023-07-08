import { createEffect, createSignal, Show } from "solid-js";

import { Button } from "../../components/Button/Button";
import { Divider } from "../../components/Divider/Divider";
import { Header } from "../../components/Header/Header";
import { Typography, Variant } from "../../components/Typography/Typography";
import styles from "./StreamingPlatform.module.css";
import { PageContainer } from "../../components/PageContainer/PageContainer";

const spotifyClientId = '6b99eeab69c44b28aa9187b60312acef'
const spotifyScopes = 'user-read-private%20user-read-email%20playlist-modify-public%20playlist-modify-private'
const spotifyRedirectUri = 'http://localhost:8000/auth/webhook/spotify/code'

export const AuthorizeStreamingPlatform = () => {
  const menuItems = [{ name: "Fluid", link: "/" }];

  return (
    <PageContainer>
      <Header items={menuItems} />
      <div class={styles.body}>
        <div class={styles.content}>
          <Typography variation={"title"}>Last step !</Typography>

          <Typography variation={"subtitle"}>
            Fluid need access to your streaming platform in order to
            automatically manage your playlists.
          </Typography>
          <Divider />
          <div class={styles.platforms}>
            <Button
              label="Spotify"
              clickHandler={() =>
                (document.location.href =
                  `https://accounts.spotify.com/authorize?response_type=code&client_id=${spotifyClientId}&scope=${spotifyScopes}&redirect_uri=${spotifyRedirectUri}`)
              }
            />
            <Button
              label="Deezer"
              clickHandler={() => console.log("Authorize Deezer")}
            />
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    </PageContainer>
  );
};
