/*
| Developed by Starton
| Filename : Typography.tsx
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { children, ParentComponent, JSX } from "solid-js";
import "./Typography.module.css";

export enum Variant {
  Auto,
  Title,
  Subtitle,
  Body,
  Caption,
}

export const Typography: ParentComponent<{
  variation?: string;
}> = (props) => {
  const text = children(() => props.children);

  switch (props.variation) {
    case undefined:
      return <p>{text()}</p>;
    case "title":
      return <h1>{text()}</h1>;
    case "subtitle":
      return <h2>{text()}</h2>;
    case "small":
      return <small>{text()}</small>;
  }
};
