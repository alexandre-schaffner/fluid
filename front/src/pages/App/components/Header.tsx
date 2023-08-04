import { type Component } from "solid-js";
import { Typography } from "../../../components/Typography/Typography";

export const Header: Component = () => {
  return (
    <div class="flex w-fit flex-col">
      <div class="mb-2 flex items-center gap-x-4">
        <div class="bg-logo bg-contain bg-center h-12 w-12 rounded-full animate-spin-very-slow" />
        <Typography variation="subtitle">Fluid</Typography>
      </div>
    </div>
  );
};
