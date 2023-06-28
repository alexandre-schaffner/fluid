/*
| Developed by Starton
| Filename : App.tsx
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import type { Component } from "solid-js";

import { Landing } from "../LandingPage/LandingPage";
import styles from "./App.module.css";

/*
|--------------------------------------------------------------------------
| APP
|--------------------------------------------------------------------------
*/

const App: Component = () => {
  return (
    <div class={styles.app}>
      <Landing />
    </div>
  );
};

export default App;
