import { Component } from "solid-js";
import "./Button.module.css";
import { Typography, Variant } from "../Typography/Typography";

export const Button: Component<{ label: string; clickHandler: () => void }> = (
  props
) => {
  const { clickHandler, label } = props;

  return (
    <button onClick={clickHandler}>
      <Typography variation={Variant.Auto}>{label}</Typography>
    </button>
  );
};
