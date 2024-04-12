import { invoke } from "@tauri-apps/api/tauri";
import { ENTRY_LIST_ITEM_PROPS } from "./entry-list";
import { ENTRY_TYPE } from "./types";
import { INTERNALS_HOME, INTERNALS_MARK } from "./internals";

type EntryBackendProps = {
  path: string;
  type_: ENTRY_TYPE;
};

type EntryDisksBackendProps = string[][];

function toFileName(path: string): string {
  return path.replace(/^.*[\\/]/, "");
}

export const getItemInfo = async (path: string): Promise<EntryBackendProps> => {
  if (path.startsWith(INTERNALS_MARK)) {
    throw Error("Tried to handle internal path that is forbidden to request!");
  }
  return await invoke("get_item_info", {
    path,
  });
};

export const deleteItem = async (path: string): Promise<EntryBackendProps> => {
  if (path.startsWith(INTERNALS_MARK)) {
    throw Error("Tried to handle internal path that is forbidden to request!");
  }
  return await invoke("delete_item", {
    path,
  });
};
export const createTextFile = async (
  path: string,
  name: string
): Promise<EntryBackendProps> => {
  if (path.startsWith(INTERNALS_MARK)) {
    throw Error("Tried to handle internal path that is forbidden to request!");
  }

  return await invoke("create_text_file", {
    path,
    name,
  });
};
export const createDirectory = async (
  path: string,
  name: string
): Promise<EntryBackendProps> => {
  if (path.startsWith(INTERNALS_MARK)) {
    throw Error("Tried to handle internal path that is forbidden to request!");
  }
  return await invoke("create_directory", {
    path,
    name,
  });
};

export const requestEntries = async (
  path: string
): Promise<ENTRY_LIST_ITEM_PROPS[] | any> => {
  if (path.startsWith(INTERNALS_MARK)) {
    if (path === INTERNALS_HOME) {
      let disks = (await invoke("get_disk_list")) as EntryDisksBackendProps;
      return disks.flatMap((disk: string[]) => {
        return {
          isBaseSelection: false,
          isSelected: false,
          displayName: `${disk[0]} [${disk[2]}]`,
          displayType: "disk",
          fullPath: disk[2],
          metadata: {
            disk: {
              filesystem: disk[2],
              sizeLeft: disk[3],
              sizeTotal: disk[4],
            },
          },
        };
      });
    }
    throw Error("Tried to handle internal path that is forbidden to request!");
  }
  let entities = (await invoke("list_directory", {
    path,
  })) as EntryBackendProps[];
  return entities.flatMap((entry: EntryBackendProps): ENTRY_LIST_ITEM_PROPS => {
    return {
      isBaseSelection: false,
      isSelected: false,
      displayName: toFileName(entry.path),
      displayType: entry.type_ as ENTRY_TYPE,
      fullPath: entry.path,
    };
  });
};
