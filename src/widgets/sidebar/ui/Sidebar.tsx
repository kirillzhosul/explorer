import { MouseEvent } from "react";
import { Item } from "@@entities/item/ui/Item";
import { ITEM } from "@@entities/item";
import styles from "./Sidebar.module.css";

type SIDEBAR_PROPS = {
  items: SIDEBAR_ITEMS;

  displayIcons: boolean;

  onClick: (item: ITEM, rmb: boolean, e: MouseEvent) => any;
};
export type SIDEBAR_ITEMS = {
  pins: ITEM[];
  drives: ITEM[];
  home: ITEM[];
};

export const Sidebar = ({ items, onClick, displayIcons }: SIDEBAR_PROPS) => {
  return (
    <div className={styles.container}>
      <ul className={styles.list}>
        {items.home.map((item) => {
          return (
            <li className={styles.list} key={item.path}>
              <Item item={item} icon={displayIcons} onClick={onClick} />
            </li>
          );
        })}
        <h4 className={styles.divider}>Drives</h4>
        {items.drives.map((item) => {
          return (
            <li className={styles.list} key={item.path}>
              <Item
                item={{
                  ...item,
                  meta: {
                    ...item.meta,
                    // TODO: weird
                    drive: undefined,
                  },
                }}
                icon={displayIcons}
                onClick={onClick}
              />
            </li>
          );
        })}

        <h4 className={styles.divider}>Pinned</h4>
        {items.pins.map((item) => {
          return (
            <li className={styles.list} key={item.path}>
              <Item item={item} icon={displayIcons} onClick={onClick} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
