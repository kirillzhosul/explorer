import { useState } from "react";
import { ITEM } from "@@entities/item";

import {
  INTERNALS_HOME,
  INTERNALS_SETTINGS,
  displayInternalPath,
} from "@@shared/lib/internals";
import { ITEM_TYPE } from "@@entities/item/model";

import { getItemInfo, itemApiToItem, requestPathWrapper } from "@api";
import { SIDEBAR_ITEMS } from "./ui/Sidebar";

export function useSidebar(): {
  items: SIDEBAR_ITEMS;
  refresh: (
    pinned: string[],
    isSelected: (path: string) => boolean,
    isBaseSelected: (path: string) => boolean,
    isPinned: (path: string) => boolean
  ) => Promise<void>;
} {
  const [drives, setDrives] = useState<ITEM[]>([]);
  const [pins, setPins] = useState<ITEM[]>([]);
  const [home, setHome] = useState<ITEM[]>([]);

  const refresh = async (
    pinned: string[],
    isSelected: (path: string) => boolean,
    isBaseSelected: (path: string) => boolean,
    isPinned: (path: string) => boolean
  ) => {
    // TODO!: can be replaced with disk query?
    setDrives(
      (await requestPathWrapper(INTERNALS_HOME)).map((item: ITEM): ITEM => {
        item.flags.selection = isSelected(item.path);
        return item;
      })
    );

    setPins(
      await Promise.all(
        pinned.map(async (path: string): Promise<ITEM> => {
          return itemApiToItem(
            await getItemInfo(path),
            isSelected,
            isBaseSelected,
            isPinned
          );
        })
      )
    );

    // TODO! Refactor that sidebar items (defaults)
    setHome([
      {
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
      },
      {
        name: displayInternalPath(INTERNALS_SETTINGS),
        path: INTERNALS_SETTINGS,
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
      },
    ]);
  };

  return {
    items: { home, drives, pins },
    refresh,
  };
}
