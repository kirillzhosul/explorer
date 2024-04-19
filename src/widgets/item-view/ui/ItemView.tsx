import { MouseEvent } from "react";
import { ITEM } from "@@entities/item";
import { ITEM_VIEW_AS } from "../types";
import { Item } from "@@entities/item/ui/Item";
import clsx from "clsx";
import styles from "./ItemView.module.css";

type ITEM_VIEW_PROPS = {
  items: ITEM[];
  viewAs: number; // TODO
  displayIcons: boolean;
  onClick: (item: ITEM, rmb: boolean, e: MouseEvent) => any;
};

export function ItemView({
  items,
  onClick,
  viewAs,
  displayIcons,
}: ITEM_VIEW_PROPS) {
  return (
    <ul
      className={clsx(
        styles.container,
        viewAs == ITEM_VIEW_AS.icons ? styles.asIcons : styles.asItems
      )}
    >
      {items.map((item) => (
        <li key={item.path} className="entry-list-item">
          <Item item={item} icon={displayIcons} onClick={onClick} />
        </li>
      ))}
    </ul>
  );
}
