import { displayInternalPath } from "@@shared/lib/internals";
import { ITEM, ITEM_TYPE } from "./types";

export const itemFactory = (
  path: string,
  type: ITEM_TYPE,
  isPinned: (path: string) => boolean = (_) => false,
  isSelected: (path: string) => boolean = (_) => false,
  isBaseSelected: (path: string) => boolean = (_) => false
): ITEM => {
  return {
    name: displayInternalPath(path),
    path: path,
    type: type,
    flags: {
      pin: isPinned(path),
      selection: isSelected(path),
      baseSelection: isBaseSelected(path),
    },
  };
};
