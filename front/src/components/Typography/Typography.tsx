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
  variation: Variant;
}> = (props) => {
  const text = children(() => props.children);

  switch (props.variation) {
    case Variant.Auto:
      return <>{text()}</>;
    case Variant.Title:
      return <h1>{text()}</h1>;
    case Variant.Subtitle:
      return <h2>{text()}</h2>;
    case Variant.Body:
      return <p>{text()}</p>;
  }
};
