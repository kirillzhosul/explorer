import { HISTORY_ACTION } from "@@shared/hooks/history/types";
import { ITEM } from "../../entities/item";
import { NAVIGATION_ACTION_TYPE } from "../../widgets/header";

import { INTERNALS_HOME, INTERNALS_MARK } from "../lib/internals";

export const navigationDispatcher = (
  type: NAVIGATION_ACTION_TYPE,
  path: string,
  pushToHistory: (action: HISTORY_ACTION, item?: ITEM, path?: string) => any,
  setPath: (path: string | ((p: string) => string)) => any,
  popPathNavigation: (path: string) => string | undefined,
  requestPath: () => any
) => {
  switch (type) {
    case NAVIGATION_ACTION_TYPE.up:
      if (path.startsWith(INTERNALS_MARK)) {
        return;
      }
      if (path.split("\\").length - 1 == 1) {
        let newPath = path.substring(0, path.lastIndexOf("\\")) + "\\";
        if (newPath != path) {
          pushToHistory(HISTORY_ACTION.internal_open_item, undefined, newPath);
          setPath(newPath);
        } else {
          pushToHistory(
            HISTORY_ACTION.internal_open_item,
            undefined,
            INTERNALS_HOME
          );
          setPath(INTERNALS_HOME);
        }
      } else {
        pushToHistory(HISTORY_ACTION.internal_open_item, undefined, path);
        setPath((path) => {
          return path.substring(0, path.lastIndexOf("\\"));
        });
      }
      break;
    case NAVIGATION_ACTION_TYPE.back:
      setPath(popPathNavigation(path) ?? INTERNALS_HOME);
      break;
    case NAVIGATION_ACTION_TYPE.forward:
      break;
    case NAVIGATION_ACTION_TYPE.refresh:
      requestPath();
      break;
  }
};
