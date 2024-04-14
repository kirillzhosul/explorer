import { useEffect } from "react";

import { usePathQuery } from "./usePathQuery";
import { useFilter } from "./useFilter";

export function usePathQueryFilter(basePath: string) {
  const { path, setPath, items, requestPath } = usePathQuery(basePath);
  const { setItems, filtered, fromSettings } = useFilter();

  useEffect(() => setItems(items), [items]);

  return {
    path,
    setPath,
    requestPath,
    filtered,
    fromSettings,
  };
}
