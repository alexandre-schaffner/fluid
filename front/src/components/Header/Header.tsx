import { Accessor, Component, For } from "solid-js";
import styles from "./Header.module.css";
import { A } from "@solidjs/router";

interface MenuItem {
  name: string;
  link: string;
}

export const Header: Component<{ items: MenuItem[] }> = (props) => {
  const { items } = props;

  return (
    <header>
      <nav class={styles.header}>
        <For each={items}>
          {(item: MenuItem, i: Accessor<number>) => {
            return (
              <A
                class={styles.headerItem}
                activeClass={styles.activePage}
                inactiveClass={styles.inactiveItem}
                href={item.link}
                end={true}
              >
                {item.name}
              </A>
            );
          }}
        </For>
      </nav>
    </header>
  );
};
