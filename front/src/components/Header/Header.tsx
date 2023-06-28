import { Accessor, Component, For } from "solid-js";
import styles from "./Header.module.css";

interface MenuItem {
  name: string;
  link: string;
}

export const Header: Component<{ items: MenuItem[] }> = (props) => {
  const { items } = props;

  return (
    <header>
      <nav class={styles.header}>
        <For each={props.items}>
          {(item: MenuItem, i: Accessor<number>) => {
            return (
              <a class="headerItem" href={item.link}>
                {item.name}
              </a>
            );
          }}
        </For>
      </nav>
    </header>
  );
};
