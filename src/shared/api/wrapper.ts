import { ITEM } from "@@entities/item";
import { INTERNALS_HOME } from "@@shared/lib/internals";
import { getBackendProvider } from "./api";
import { diskApiToItem, itemApiToItem } from "./converter";
import { ITEM_API_DTO } from "./types";

export const requestPathWrapper = async (path: string): Promise<ITEM[]> => {
  const provider = getBackendProvider();
  if (path === INTERNALS_HOME) {
    return (await provider.getDiskList()).flatMap((item) => {
      return diskApiToItem(item);
    });
  }

  return (await provider.listDirectory(path)).flatMap(
    (entry: ITEM_API_DTO): ITEM => {
      return itemApiToItem(entry);
    }
  );
};
