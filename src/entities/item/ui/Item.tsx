import { PinIcon } from "@@shared/icons/PinIcon";
import clsx from "clsx";
import { MouseEvent } from "react";
import { ITEM, ITEM_TYPE } from "../model";
import styles from "./Item.module.css";

import { getFileExtension } from "@@shared/lib/path";
import { ItemIcon } from "./icon/ItemIcon";

type ITEM_PROPS = {
  item: ITEM;
  icon: boolean;
  onClick: (item: ITEM, rmb: boolean, e: MouseEvent) => any;
};

export function Item({ item, icon, onClick }: ITEM_PROPS) {
  const withDriveInfo =
    item.type === ITEM_TYPE.drive && item.meta?.drive !== undefined;
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
        onClick(item, false, e);
      }}
      onContextMenu={(e) => {
        onClick(item, true, e);
      }}
    >
      {icon && (
        <ItemIcon type={item.type} extension={getFileExtension(item.name)} />
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
