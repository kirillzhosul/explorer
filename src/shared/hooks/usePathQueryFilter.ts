import { useEffect } from "react";

import { usePathQuery } from "./usePathQuery";
import { useFilter } from "./useFilter";

export function usePathQueryFilter(basePath: string) {
  const { path, setPath, items, requestPath, error } = usePathQuery(basePath);
  const { setItems: setItemsToFilter, filtered, fromSettings } = useFilter();

  useEffect(() => setItemsToFilter(items), [items]);

  return {
    path,
    setPath,
    requestPath,
    error,
    filtered,
    fromSettings,
  };
}
