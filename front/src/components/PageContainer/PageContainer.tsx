import { ParentComponent, children } from "solid-js";
import styles from "./PageContainer.module.css";

enum Direction {
  Vertical,
  Horizontal,
}

export const PageContainer: ParentComponent<{ direction?: Direction }> = (
  props = { direction: Direction.Vertical }
) => {
  const { direction } = props;

  return (
    <div
      class={
        direction === Direction.Horizontal
          ? styles.horizontalPageContainer
          : styles.verticalPageContainer
      }
    >
      {children(() => props.children)()}
    </div>
  );
};
