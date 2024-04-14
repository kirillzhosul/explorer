import { MouseEvent } from "react";
import { ITEM, ITEM_TYPE } from "../model";
import clsx from "clsx";
import { PinIcon } from "@@shared/icons/PinIcon";
import styles from "./Item.module.css";

import { extensionFromPath } from "@@shared/lib/path";
import { ItemIcon } from "./icon/ItemIcon";

type ITEM_PROPS = {
  item: ITEM;
  icon: boolean;
  onClick: (item: ITEM, e: MouseEvent) => any;
};

export function Item({ item, icon, onClick }: ITEM_PROPS) {
  const withDriveInfo =
    item.type == ITEM_TYPE.drive && item.meta?.drive !== undefined;
  let classNames = [styles.container];

  if (item.flags.selection) {
    classNames.push(styles.selected);
  } else if (item.flags.baseSelection) {
    classNames.push(styles.baseSelected);
  } else {
    classNames.push(styles.unselected);
  }

  return (
    <div
      className={clsx(...classNames)}
      onClick={(e) => {
        onClick(item, e);
      }}
    >
      {icon && (
        <ItemIcon type={item.type} extension={extensionFromPath(item.name)} />
      )}

      <span>{item.name}</span>

      {item.flags.pin && <PinIcon width="12px" height="12px" />}

      {withDriveInfo && (
        <span className={styles.driveInfo}>
          {item.meta?.drive?.left} / {item.meta?.drive?.capacity}
        </span>
      )}
    </div>
  );
}
