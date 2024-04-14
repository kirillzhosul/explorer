import { ITEM } from "../../entities/item";
import { INTERNALS_HOME } from "../internals";
import { getDiskList, listDirectory } from "./api";
import { diskApiToItem, itemApiToItem } from "./converter";
import { ITEM_API_DTO } from "./types";

export const requestPathWrapper = async (path: string): Promise<ITEM[]> => {
  if (path === INTERNALS_HOME) {
    return (await getDiskList()).flatMap((item) => {
      return diskApiToItem(item);
    });
  }

  return (await listDirectory(path)).flatMap((entry: ITEM_API_DTO): ITEM => {
    return itemApiToItem(entry);
  });
};
