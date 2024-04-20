import { useState } from "react";
import { ITEM } from "@@entities/item";

import { INTERNALS_HOME, INTERNALS_SETTINGS } from "@@shared/lib/internals";
import { ITEM_TYPE, itemFactory } from "@@entities/item/model";

import { diskApiToItem, getDiskList, getItemInfo, itemApiToItem } from "@api";
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
    setDrives(
      (await getDiskList()).flatMap((r) =>
        diskApiToItem(r, isSelected, isBaseSelected, isPinned)
      )
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

    setHome([
      itemFactory(
        INTERNALS_HOME,
        ITEM_TYPE.directory,
        undefined,
        isSelected,
        isBaseSelected
      ),
      itemFactory(
        INTERNALS_SETTINGS,
        ITEM_TYPE.directory,
        undefined,
        isSelected,
        isBaseSelected
      ),
    ]);
  };

  return {
    items: { home, drives, pins },
    refresh,
  };
}
