import { useState } from "react";
import { ITEM } from "../../entities/item";

import {
  INTERNALS_HOME,
  INTERNALS_SETTINGS,
  displayInternalPath,
} from "../../shared/internals";
import { ITEM_TYPE } from "../../entities/item/model";
import { getItemInfo } from "../../shared/api/api";
import { itemApiToItem } from "../../shared/api/converter";
import { requestPathWrapper } from "../../shared/api/wrapper";

export function useSidebar() {
  const [items, setItems] = useState<ITEM[]>([]);

  const refreshItems = async (
    pinned: string[],
    isSelected: (path: string) => boolean,
    isBaseSelected: (path: string) => boolean,
    isPinned: (path: string) => boolean
  ) => {
    let sidebarItems: ITEM[] = [];

    // TODO!: can be replaced with disk query?
    sidebarItems.push(
      ...(await requestPathWrapper(INTERNALS_HOME)).map((item: ITEM): ITEM => {
        item.flags.selection = isSelected(item.path);
        return item;
      })
    );

    sidebarItems.push(
      ...(await Promise.all(
        pinned.map(async (path: string): Promise<ITEM> => {
          return itemApiToItem(
            await getItemInfo(path),
            isSelected,
            isBaseSelected,
            isPinned
          );
        })
      ))
    );

    // TODO! Refactor that sidebar items (defaults)
    sidebarItems.push({
      name: displayInternalPath(INTERNALS_HOME),
      path: INTERNALS_HOME,
      type: ITEM_TYPE.directory,
      flags: {
        pin: false,

        // TODO?: can cause bugs?
        selection: isSelected(INTERNALS_HOME),
        baseSelection: isBaseSelected(INTERNALS_HOME),
      },
      meta: {
        size: 0,
      },
    });

    sidebarItems.push({
      name: displayInternalPath(INTERNALS_SETTINGS),
      path: INTERNALS_SETTINGS,
      type: ITEM_TYPE.directory,
      flags: {
        pin: false,

        // TODO?: can cause bugs?
        selection: isSelected(INTERNALS_SETTINGS),
        baseSelection: isBaseSelected(INTERNALS_SETTINGS),
      },
      meta: {
        size: 0,
      },
    });

    setItems(sidebarItems);
  };
  return {
    items,
    refreshItems,
  };
}
