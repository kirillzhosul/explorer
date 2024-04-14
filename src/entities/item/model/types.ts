import { ITEM_METADATA } from "./metadata";

export enum ITEM_TYPE {
  directory,
  file,
  drive,
}

export type ITEM_FLAGS = {
  pin: boolean;
  selection: boolean;
  baseSelection: boolean;
};

export type ITEM = {
  name: string;
  path: string;
  type: ITEM_TYPE;

  flags: ITEM_FLAGS;
  meta?: ITEM_METADATA;
};
