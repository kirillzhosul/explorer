import { useState } from "react";
import { ITEM } from "@@entities/item";
import { getBackendProvider } from "@api";
import { ITEM_API_DTO } from "@api";
import { itemApiToItem } from "@api";
import { getPathSeparator } from "@@shared/lib/path";

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
    const ph = getPathSeparator();
    let basePath = path.endsWith(ph) ? path : path + ph;
    let pattern = basePath + searchQuery;

    getBackendProvider()
      .searchGlob(pattern)
      .then((items) => {
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
