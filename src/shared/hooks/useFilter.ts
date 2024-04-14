import { useEffect, useState } from "react";
import { ITEM } from "@@entities/item";
import { SettingsDTO } from "@@shared/settings";

function sortPredicate(a: ITEM, b: ITEM) {
  /**
   * Sort implementation for the filtered list
   * TODO: Sort by
   * TODO! Refactor with sorter
   */
  if (a.type < b.type) {
    return -1;
  }
  if (a.type > b.type) {
    return 1;
  }
  return 0;
}

export type ENTRY_FILTERS = {
  hideDotFiles: boolean;
  hideSystem: boolean;
  hideHidden: boolean;
};

export const useFilter = () => {
  const [items, setItems] = useState<ITEM[]>([]);
  const [filtered, setFiltered] = useState<ITEM[]>([]);
  const [filters, setFilters] = useState<ENTRY_FILTERS>({
    hideDotFiles: false,
    hideHidden: true,
    hideSystem: true,
  });

  const fromSettings = (dto: SettingsDTO) => {
    setFilters({
      hideDotFiles: dto.hideDottedFiles,
      hideSystem: dto.hideSystem,
      hideHidden: dto.hideHidden,
    });
  };

  const filter = () => {
    let buf = items.sort(sortPredicate);

    if (filters.hideDotFiles) {
      buf = buf.filter((i) => !i.name.startsWith("."));
    }

    if (filters.hideHidden) {
      buf = buf.filter((i) => !i.meta?.attributes?.hidden);
    }

    if (filters.hideSystem) {
      buf = buf.filter((i) => !i.meta?.attributes?.system);
    }

    setFiltered(buf);
  };

  useEffect(filter, [items, filters]);

  return {
    setFilters,
    setItems,
    filtered,
    fromSettings,
  };
};
