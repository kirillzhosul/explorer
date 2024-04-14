import { MouseEvent } from "react";
import { Item } from "../../../entities/item/ui/Item";
import { ITEM } from "../../../entities/item";

type SIDEBAR_PROPS = {
  items: ITEM[];

  displayIcons: boolean;

  onClick: (item: ITEM, e: MouseEvent) => any;
};

export const Sidebar = ({ items, onClick, displayIcons }: SIDEBAR_PROPS) => {
  return (
    <div className="sidebar">
      <ul className="sidebar-list">
        {items.map((item) => {
          return (
            <li className="sidebar-list-item" key={item.path}>
              <Item item={item} icon={displayIcons} onClick={onClick} />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
