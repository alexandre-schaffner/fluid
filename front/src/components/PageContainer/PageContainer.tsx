import { ParentComponent, children } from "solid-js";
import styles from "./PageContainer.module.css";

export const PageContainer: ParentComponent = (props) => {
  return (
    <div class={styles.verticalPageContainer}>
      {children(() => props.children)()}
    </div>
  );
};
