import { type Component } from "solid-js";

import { Typography } from "../Typography/Typography";

export const Button: Component<{ label: string; clickHandler: () => void }> = (
  props,
) => {
  const { clickHandler, label } = props;

  return (
    <button
      class={
        "max-h-fit w-64 rounded-lg border border-blue-500 hover:border-blue-400 bg-blue-600 p-4 hover:bg-blue-500"
      }
      onClick={clickHandler}
    >
      <Typography>{label}</Typography>
    </button>
  );
};
