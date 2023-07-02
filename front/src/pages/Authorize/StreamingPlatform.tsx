import { createEffect, createSignal, Show } from "solid-js";

import { Button } from "../../components/Button/Button";
import { Divider } from "../../components/Divider/Divider";
import { Header } from "../../components/Header/Header";
import { Typography, Variant } from "../../components/Typography/Typography";
import styles from "./StreamingPlatform.module.css";
import { PageContainer } from "../../components/PageContainer/PageContainer";

export const AuthorizeStreamingPlatform = () => {
  const menuItems = [{ name: "Fluid", link: "/" }];

  return (
    <PageContainer>
      <Header items={menuItems} />
      <div class={styles.body}>
        <div class={styles.content}>
          <Typography variation={Variant.Title}>Last step !</Typography>

          <Typography variation={Variant.Subtitle}>
            Fluid need access to your streaming platform in order to
            automatically manage your playlists.
          </Typography>
          <Divider />
          <div class={styles.platforms}>
            <Button
              label="Spotify"
              clickHandler={() =>
                (document.location.href =
                  "https://accounts.spotify.com/authorize?response_type=code&client_id=6b99eeab69c44b28aa9187b60312acef&scope=playlist-modify-public%20playlist-modify-private&redirect_uri=http://localhost:8000/auth/webhook/spotify/code")
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
