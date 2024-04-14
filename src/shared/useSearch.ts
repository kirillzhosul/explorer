import { useState } from "react";
import { ITEM } from "../entities/item";
import { searchGlob } from "./api/api";
import { ITEM_API_DTO } from "./api/types";
import { itemApiToItem } from "./api/converter";

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [foundItems, setFoundItems] = useState<ITEM[]>([]);

  const search = (
    path: string,
    isSelected: (path: string) => boolean,
    isBaseSelected: (path: string) => boolean,
    isPinned: (path: string) => boolean
  ) => {
    // TODO: Weird hooks nah
    if (searchQuery === "") {
      setFoundItems([]);
      return;
    }

    // TODO: Refactor
    let basePath = path.endsWith("\\") ? path : path + "\\";
    let pattern = basePath + searchQuery;

    searchGlob(pattern).then((items) => {
      setFoundItems(
        items.flatMap((item: ITEM_API_DTO): ITEM => {
          return itemApiToItem(item, isSelected, isBaseSelected, isPinned);
        })
      );
    });
  };

  return {
    searchQuery,
    setSearchQuery,
    search,
    foundItems,
  };
}
