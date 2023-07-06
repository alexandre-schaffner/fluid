/*
| Developed by Starton
| Filename : YouTube.tsx
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { Component, createEffect, createSignal, Show } from "solid-js";

import { Divider } from "../../components/Divider/Divider";
import { Header } from "../../components/Header/Header";
import { Typography } from "../../components/Typography/Typography";
import styles from "./Youtube.module.css";
import { Button } from "../../components/Button/Button";
import { useSearchParams } from "@solidjs/router";
import { PageContainer } from "../../components/PageContainer/PageContainer";

/*
|--------------------------------------------------------------------------
| LANDING PAGE
|--------------------------------------------------------------------------
*/

export const AuthorizeYouTube: Component = () => {
  const menuItems = [{ name: "Fluid", link: "/" }];
  const [width, setWidth] = createSignal(window.screen.availWidth);
  const [searchParams, setSearchParams] = useSearchParams();

  window.addEventListener("resize", () => setWidth(window.screen.availWidth));

  const { user, state } = searchParams;

  const client = google.accounts.oauth2.initCodeClient({
    client_id:
      "205349973317-s5h03qvn3hlnjhoe52nu66aso811nlml.apps.googleusercontent.com",
    scope: "https://www.googleapis.com/auth/youtube.readonly",
    ux_mode: "redirect",
    redirect_uri: "http://localhost:8000/auth/webhook/authorize/youtube",
    state: state,
  });

  return (
    <PageContainer>
      <Header items={menuItems} />
      <div class={styles.body}>
        <div class={styles.content}>
          <Typography variation={"title"}>
            Welcome {user},
            <br />
          </Typography>

          <Typography variation={"subtitle"}>
            Fluid requires access to your YouTube account in order to track
            music you like.
          </Typography>
          <Divider />
          <Show when={width() <= 992}>
            <div class={styles.getStarted}>
              <Button
                label="Authorize YouTube"
                clickHandler={() => client.requestCode()}
              />
            </div>
          </Show>
        </div>
        <Show when={width() > 992}>
          <div class={styles.getStarted}>
            <Button
              label="Authorize YouTube"
              clickHandler={() => client.requestCode()}
            />
          </div>
        </Show>
        {/* <Footer /> */}
      </div>
    </PageContainer>
  );
};

export default AuthorizeYouTube;
