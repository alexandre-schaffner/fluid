/*
| Developed by Starton
| Filename : App.tsx
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import type { Component } from "solid-js";

import { Landing } from "../LandingPage/LandingPage";
import styles from "./App.module.css";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import { Header } from "../../components/Header/Header";

/*
|--------------------------------------------------------------------------
| APP
|--------------------------------------------------------------------------
*/

const App: Component = () => {
  return (
    <PageContainer>
      <Header items={[{ name: "Fluid", link: "http://localhost:3000/" }]} />
    </PageContainer>
  );
};

export default App;
