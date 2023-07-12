/*
| Developed by Starton
| Filename : App.tsx
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import type { Component } from "solid-js";

import axios from "axios";
import { PageContainer } from "../../components/PageContainer/PageContainer";
import { Header } from "../../components/Header/Header";
import { Button } from "../../components/Button/Button";

/*
|--------------------------------------------------------------------------
| APP
|--------------------------------------------------------------------------
*/

const App: Component = () => {
  return (
    <PageContainer>
      <Header items={[{ name: "Fluid", link: "http://localhost:3000/" }]} />
      <Button label="Sync" clickHandler={async () => {
        await axios.post('http://localhost:8000/platform/sync', {}, {
          withCredentials: true
        })
      }
    }
      />
    </PageContainer>
  );
};

export default App;
