/* @refresh reload */
import "./index.css";

import { Route, Router, Routes } from "@solidjs/router";
import { render } from "solid-js/web";

import App from "./pages/App/App";
import { AuthorizeStreamingPlatform } from "./pages/Authorize/StreamingPlatform";
import { AuthorizeYouTube } from "./pages/Authorize/YouTube";
import Landing from "./pages/LandingPage/LandingPage";
import { SelectPlaylist } from "./pages/SelectPlaylist/SelectPlaylist";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?"
  );
}

render(
  () => (
    <Router>
      <Routes>
        <Route path="/" component={Landing} />
        <Route path="/authorize">
          <Route path="/youtube" component={AuthorizeYouTube} />
          <Route
            path="/streaming-platform"
            component={AuthorizeStreamingPlatform}
          />
        </Route>
        <Route path="/playlist" component={SelectPlaylist} />
        <Route path="/app" component={App} />
      </Routes>
    </Router>
  ),
  root!
);
