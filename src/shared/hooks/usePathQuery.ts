import { useEffect, useState } from "react";
import { ITEM } from "@@entities/item";
import { requestPathWrapper } from "../api/wrapper";

export function usePathQuery(basePath: string) {
  const [path, setPath] = useState<string>(basePath);
  const [items, setItems] = useState<ITEM[]>([]);
  const [error, setError] = useState<any>();

  const request = () => {
    requestPathWrapper(path)
      .then(setItems)
      .catch((error) => {
        console.log(
          "[usePathQuery] Got request error, items wiped, error was set!",
          error
        );
        setError(error);
        setItems([]);
      });
  };

  useEffect(request, [path]);

  return {
    path,
    setPath,
    items,
    error,
    requestPath: request,
  };
}
