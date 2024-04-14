import { ITEM } from "../../entities/item";

export enum HISTORY_ACTION {
  internal_open_item,

  execute_item,
  create_item, // TODO: Not implemented
}
export type HISTORY_SEGMENT = {
  path: string;
  item?: ITEM;
  action: HISTORY_ACTION;
};
