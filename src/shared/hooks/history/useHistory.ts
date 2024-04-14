import { useState } from "react";
import { HISTORY_ACTION, HISTORY_SEGMENT } from "./types";
import { ITEM } from "@@entities/item";
import { NAVIGATION_ACTION_TYPE } from "../../../widgets/header";
import { INTERNALS_MARK } from "@@shared/lib/internals";

export const useHistory = (size: number = 100) => {
  const [history, setHistory] = useState<HISTORY_SEGMENT[]>([]);

  const push = (action: HISTORY_ACTION, item?: ITEM, path?: string) => {
    setHistory((p) => {
      let n = [...p];
      if (item) {
        n.push({
          path: item.path,
          item: item,
          action: action,
        });
      } else if (path) {
        n.push({
          path: path,
          item: undefined,
          action: action,
        });
      } else {
        throw Error("Non-success push to history");
      }

      if (n.length > size) {
        return n.slice(n.length - size, undefined);
      }
      return n;
    });
  };

  const popPathNavigation = (path: string): string => {
    // TODO: what the heck is going here?
    // refactor next morning
    let segment = history.pop();

    while (
      segment !== undefined &&
      ((segment.action === HISTORY_ACTION.internal_open_item &&
        (segment?.item?.path === path || segment.path === path)) ||
        segment.action === HISTORY_ACTION.execute_item)
    ) {
      segment = history.pop();
    }

    if (segment !== undefined) {
      return segment.path;
    }

    return path;
  };

  const getNavigationDisabledActions = (
    path: string
  ): NAVIGATION_ACTION_TYPE[] => {
    let actions: NAVIGATION_ACTION_TYPE[] = [NAVIGATION_ACTION_TYPE.forward];

    // TODO: disable bookmark, allow to un-bookmark
    if (path.startsWith(INTERNALS_MARK)) {
      actions.push(NAVIGATION_ACTION_TYPE.up);
    }
    if (history.length === 0) {
      actions.push(NAVIGATION_ACTION_TYPE.back);
    }
    return actions;
  };

  return {
    items: history,
    push,
    getNavigationDisabledActions,
    popPathNavigation,
  };
};
