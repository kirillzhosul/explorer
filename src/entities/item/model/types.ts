import { ITEM_METADATA } from "./metadata";

// NOTICE: should match string from the API
enum ITEM_TYPE {
  directory,
  file,
  drive,
}

type ITEM = {
  name: string;
  path: string;
  type: ITEM_TYPE;

  flags: {
    pin: boolean;
    selection: boolean;
    baseSelection: boolean;
  };
  meta?: ITEM_METADATA;
};

export { ITEM_TYPE };
export type { ITEM };
