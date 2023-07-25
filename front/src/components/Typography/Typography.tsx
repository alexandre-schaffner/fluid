/*
| Developed by Starton
| Filename : Typography.tsx
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { children, type ParentComponent } from "solid-js";

export enum Variant {
  Auto,
  Title,
  Subtitle,
  Body,
  Caption,
}

export const Typography: ParentComponent<{
  variation?: string;
  color?: string;
}> = (props) => {
  const text = children(() => props.children);
  const color = props.color;

  switch (props.variation) {
    case "title":
      return (
        <div
        class={
          "font-sans text-6xl/tight font-medium text-blue-200 subpixel-antialiased"
        }
        >
          <h1>{text()}</h1>
        </div>
      );
      case "subtitle":
        return (
          <div class={"font-sans text-4xl text-blue-400 subpixel-antialiased"}>
          <h2>{text()}</h2>
        </div>
      );
      case 'cardTitle':
        return (
          <div class={"font-sans text-4xl font-medium text-blue-200 subpixel-antialiased"}>
          <h3>{text()}</h3>
        </div>
      );
      case "small":
        return <small class={"font-sans text-sm text-blue-50"}>{text()}</small>;
      default:
        return (
          <div class={"font-sans text-xl text-blue-50 subpixel-antialiased"} classList={{'text-blue-400': color === 'light-blue'}}>
            <p>{text()}</p>
          </div>
        );
  }
};
