import { ITEM } from "@@entities/item";
import { SettingsDTO } from "@@shared/settings";
import { useEffect, useState } from "react";

function getSortPredicate(order_by_field: FILTER_ORDER_BY_FIELD, order_by_direction: FILTER_ORDER_BY_DIRECTION) {
  /**
   * Sort implementation for the filtered list
   * TODO: Sort by
   * TODO! Refactor with sorter
   */

  if (order_by_field == FILTER_ORDER_BY_FIELD.TYPE) {
    return (a: ITEM, b: ITEM): number => {

      if (order_by_direction == FILTER_ORDER_BY_DIRECTION.DESCENDING) {
        if (a.type < b.type) return -1;
        if (a.type > b.type) return 1;
        return 0;
      }

      if (a.type < b.type) return 1;
      if (a.type > b.type) return -1;

      return 0
    }
  }

  if (order_by_field == FILTER_ORDER_BY_FIELD.NAME) {
    // TODO: better name sorting
    return (a: ITEM, b: ITEM): number => {
      if (order_by_direction == FILTER_ORDER_BY_DIRECTION.DESCENDING) {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
      }

      if (a.name.toLowerCase() < b.name.toLowerCase()) return 1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;

      return 0
    }
  }
  throw new Error("`order_by_field` is unknown for getting sort predicate")
}

export enum FILTER_ORDER_BY_FIELD {
  TYPE,
  NAME
}

export enum FILTER_ORDER_BY_DIRECTION {
  ASCENDING,
  DESCENDING
}

export type ENTRY_FILTERS = {
  hideDotFiles: boolean;
  hideSystem: boolean;
  hideHidden: boolean;
  sortOrderByField: FILTER_ORDER_BY_FIELD,
  sortOrderByDirection: FILTER_ORDER_BY_DIRECTION,
};

export const useFilter = () => {
  const [items, setItems] = useState<ITEM[]>([]);
  const [filtered, setFiltered] = useState<ITEM[]>([]);
  const [filters, setFilters] = useState<ENTRY_FILTERS>({
    hideDotFiles: false,
    hideHidden: true,
    hideSystem: true,
    sortOrderByDirection: FILTER_ORDER_BY_DIRECTION.DESCENDING,
    sortOrderByField: FILTER_ORDER_BY_FIELD.NAME,
  });

  const fromSettings = (dto: SettingsDTO) => {
    setFilters({
      hideDotFiles: dto.hideDottedFiles,
      hideSystem: dto.hideSystem,
      hideHidden: dto.hideHidden,
      // TODO
      sortOrderByDirection: filters.sortOrderByDirection,
      sortOrderByField: filters.sortOrderByField,
    });
  };

  const filter = () => {
    let buf = items.sort(getSortPredicate(filters.sortOrderByField, filters.sortOrderByDirection));

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
