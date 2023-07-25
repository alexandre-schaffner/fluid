/*
| Developed by Starton
| Filename : Button.tsx
| Author : Alexandre Schaffner (alexandre.s@starton.com)
*/

import { type ParentComponent, splitProps } from 'solid-js';

import { Typography } from '../Typography/Typography';

/*
|--------------------------------------------------------------------------
| Button
|--------------------------------------------------------------------------
*/


// Props
// --------------------------------------------------------------------------
interface ButtonProps {
  label?: string;
  style: string;
  clickHandler: () => void;
}

// Component
// --------------------------------------------------------------------------
export const Button: ParentComponent<ButtonProps> = (props) => {
  const [local, others] = splitProps(props, ["label", "style", "clickHandler"]);
  const children = props.children;

  return (
    <button
      class={
        "max-h-fit w-full rounded-md border border-blue-500 p-4 hover:border-blue-400"
      }
      onClick={local.clickHandler}
      classList={{
        "bg-slate-800": local.style === "outline",
        "hover:bg-slate-700": local.style === "outline",
        "bg-blue-600": local.style === "solid",
        "hover:bg-blue-500": local.style === "solid",
      }}
    >
      {children ?? <Typography>{local.label}</Typography>}
    </button>
  );
};
