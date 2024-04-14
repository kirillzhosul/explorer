import { useEffect, useState } from "react";
import { ITEM } from "../entities/item";
import { requestPathWrapper } from "./api/wrapper";

export function usePathQuery(basePath: string) {
  const [path, setPath] = useState<string>(basePath);
  const [items, setItems] = useState<ITEM[]>([]);

  const request = () => {
    requestPathWrapper(path).then(setItems);
  };

  useEffect(request, [path]);

  return {
    path,
    setPath,
    items,
    requestPath: request,
  };
}
