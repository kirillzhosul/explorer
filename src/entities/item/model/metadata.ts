import { WINDOWS_ATTRIBUTES } from "@@shared/attributes/windows";

export type ITEM_METADATA = {
  attributes?: WINDOWS_ATTRIBUTES;
  drive?: {
    filesystem: string;
    capacity: string;
    left: string;
  };

  // Only refers to the file size, otherwise will be zero
  size?: number;
};
