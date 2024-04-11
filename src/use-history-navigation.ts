import { useState } from "react";
import { ENTRY_LIST_ITEM_PROPS } from "./entry-list";
import { NAVIGATION_TYPE } from "./navigation-header";
import { INTERNALS_MARK } from "./internals";

const HISTORY_SIZE = 100;

type HistoryAction = "open_entry" | "execute_file";
type HistoryElement = {
  path: string;
  entry?: ENTRY_LIST_ITEM_PROPS;
  action: HistoryAction;
};
export const useHistoryNavigation = () => {
  const [history, setHistory] = useState<HistoryElement[]>([]);

  const pushToHistory = (
    action: HistoryAction,
    entry?: ENTRY_LIST_ITEM_PROPS,
    path?: string
  ) => {
    setHistory((previous) => {
      let newHistory = [...previous];
      if (entry) {
        newHistory.push({
          path: entry.fullPath,
          entry: entry,
          action: action,
        });
      } else if (path) {
        newHistory.push({
          path: path,
          entry: undefined,
          action: action,
        });
      }

      if (newHistory.length > HISTORY_SIZE) {
        return newHistory.slice(newHistory.length - HISTORY_SIZE, undefined);
      }
      return newHistory;
    });
  };

  const popPathNavigation = (path: string): string => {
    let entry = history.pop();

    while (
      entry !== undefined &&
      ((entry.action === "open_entry" &&
        (entry?.entry?.fullPath === path || entry.path === path)) ||
        entry.action === "execute_file")
    ) {
      entry = history.pop();
    }

    if (entry !== undefined) {
      return entry.path;
    }

    return path;
  };
  const getNavigationDisabledActions = (path: string): NAVIGATION_TYPE[] => {
    let actions: NAVIGATION_TYPE[] = ["forward"];

    if (path.startsWith(INTERNALS_MARK)) {
      actions.push("above");
    }
    if (history.length === 0) {
      actions.push("back");
    }
    return actions;
  };
  return {
    history,
    pushToHistory,
    getNavigationDisabledActions,
    popPathNavigation,
  };
};
