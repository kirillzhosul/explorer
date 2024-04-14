import { WINDOWS_ATTRIBUTES } from "../../../shared/attributes/windows";

export type ITEM_FILESYSTEM = "ntfs" | any;
export type ITEM_METADATA_DISK = {
  filesystem: ITEM_FILESYSTEM;
  capacity: number;
  left: number;
};
export type ITEM_METADATA = {
  attributes?: WINDOWS_ATTRIBUTES;

  drive?: ITEM_METADATA_DISK;
  // Only refers to the file size, otherwise will be zero
  size?: number;
};
