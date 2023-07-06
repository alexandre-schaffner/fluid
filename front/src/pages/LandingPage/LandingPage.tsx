/*
| Developed by Starton
| Filename : Landing.tsx
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { Component, createEffect, createSignal, Show } from "solid-js";

import { Divider } from "../../components/Divider/Divider";
import { Header } from "../../components/Header/Header";
import { SignInWithGoogle } from "../../components/SignInWithGoogle/SignInWithGoogle";
import { Typography, Variant } from "../../components/Typography/Typography";
import styles from "./LandingPage.module.css";
import { PageContainer } from "../../components/PageContainer/PageContainer";

/*
|--------------------------------------------------------------------------
| LANDING PAGE
|--------------------------------------------------------------------------
*/

export const Landing: Component = () => {
  const menuItems = [{ name: "Fluid", link: "/" }];
  const [width, setWidth] = createSignal(window.screen.availWidth);

  const ogWindowSize = window.screen.availWidth;
  window.addEventListener("resize", () => setWidth(window.screen.availWidth));

  createEffect(() => {
    if (width() <= 992 && ogWindowSize > 992) location.reload();
    if (width() > 992 && ogWindowSize <= 992) location.reload();
  });

  return (
    <PageContainer>
      <Header items={menuItems} />
      <div class={styles.body}>
        <div class={styles.content}>
          <Typography variation="title">
            Discover on YouTube, enjoy on Spotify
          </Typography>

          <Typography variation="subtitle">
            Fluid automatically saves your YouTube music discoveries to a
            Spotify playlist of your choice.
          </Typography>
          <Divider />
          <Typography>Sign-in with Google to get started.</Typography>
          <Show when={width() <= 992}>
            <div class={styles.getStarted}>
              <SignInWithGoogle />
            </div>
          </Show>
        </div>
        <Show when={width() > 992}>
          <div class={styles.getStarted}>
            <SignInWithGoogle />
          </div>
        </Show>
        {/* <Footer /> */}
      </div>
    </PageContainer>
  );
};

export default Landing;
