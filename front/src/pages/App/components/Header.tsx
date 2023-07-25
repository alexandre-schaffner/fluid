import { type Component } from "solid-js";
import { Typography } from "../../../components/Typography/Typography";
import { Divider } from "../../../components/Divider/Divider";

export const Header: Component = () => {
  return (
    <div class="flex w-fit flex-col">
      <div class="mb-2 flex items-baseline gap-x-8">
        <Typography variation="title">Fluid</Typography>
        <Typography variation="subtitle">Homepage</Typography>
      </div>
      <Divider />
    </div>
  );
};
