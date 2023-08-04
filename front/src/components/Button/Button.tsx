/*
| Developed by Fluid
| Filename : Button.tsx
| Author : Alexandre Schaffner (alexandre.schaffner@icloud.com)
*/

import { type ParentComponent, splitProps } from "solid-js";

import { Typography } from "../Typography/Typography";

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
  isDisabled?: boolean;
  clickHandler: () => void;
}

// Component
// --------------------------------------------------------------------------
export const Button: ParentComponent<ButtonProps> = (props) => {
  const [local] = splitProps(props, [
    "label",
    "style",
    "isDisabled",
    "clickHandler",
  ]);

  const children = props.children;

  return (
    <button
      disabled={local.isDisabled}
      class={
        "max-h-fit w-full rounded-md border border-blue-500 p-4 transition-all duration-100 hover:border-blue-400"
      }
      onClick={local.clickHandler}
      classList={{
        "bg-slate-800": local.style === "outline" || local.isDisabled,
        "hover:bg-slate-700":
          local.style === "outline" && local.isDisabled !== true,

        "bg-blue-600 hover:bg-blue-500":
          local.style === "solid" && local.isDisabled !== true,

        "cursor-default": local.isDisabled,
      }}
    >
      {children ?? <Typography>{local.label}</Typography>}
    </button>
  );
};
