import { ITEM } from "@@entities/item";
import { INTERNALS_MARK } from "@@shared/lib/internals";
import { useEffect, useState } from "react";
import { requestPathWrapper } from "../api/wrapper";

export function usePathQuery(basePath: string) {
  const [path, setPath] = useState<string>(basePath);
  const [items, setItems] = useState<ITEM[]>([]);
  const [error, setError] = useState<any>(undefined);

  const request = () => {
    if (path.startsWith(INTERNALS_MARK)) {
      setItems([]);
      setError(undefined);
      return;
    }
    requestPathWrapper(path)
      .then((data) => {
        setError(undefined)
        setItems(data)
      })
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
