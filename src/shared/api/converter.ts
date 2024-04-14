import { ITEM } from "@@entities/item";
import { ITEM_TYPE } from "@@entities/item/model";
import { parseWindowsAttributes } from "@@shared/attributes/windows";
import { displayBaseNameFromPath } from "@@shared/lib/path";
import { ITEM_API_DTO } from "./types";

export const itemApiToItem = (
  item: ITEM_API_DTO,
  isSelected: (path: string) => boolean = () => false,
  isBaseSelected: (path: string) => boolean = () => false,
  isPinned: (path: string) => boolean = () => false
): ITEM => {
  return {
    name: displayBaseNameFromPath(item.path),
    // TODO: fix?
    type: ITEM_TYPE[item.type_ as unknown as keyof typeof ITEM_TYPE],
    path: item.path,
    flags: {
      pin: isPinned(item.path),
      selection: isSelected(item.path),
      baseSelection: isBaseSelected(item.path),
    },
    meta: {
      attributes: parseWindowsAttributes(item.attributes.windows),
      size: item.file_size,
    },
  };
};

// TODO: Custom type
export const diskApiToItem = (
  disk: string[],
  isSelected: (path: string) => boolean = () => false,
  isBaseSelected: (path: string) => boolean = () => false,
  isPinned: (path: string) => boolean = () => false
): ITEM => {
  const path = disk[2];
  const name = disk[0];
  return {
    path,
    name: `${name} [${path}]`,
    type: ITEM_TYPE.drive,
    flags: {
      pin: isPinned(path),
      selection: isSelected(path),
      baseSelection: isBaseSelected(path),
    },
    meta: {
      attributes: undefined,
      size: 0,
    },
  };
};
