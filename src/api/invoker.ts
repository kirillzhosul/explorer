import { invoke } from "@tauri-apps/api/tauri";
import { ENTRY_LIST_ITEM_PROPS } from "../entry/entry-list";
import { ENTRY_TYPE } from "../entry/types";
import { INTERNALS_HOME, INTERNALS_MARK } from "../internals/const";

type EntryBackendProps = {
  path: string;
  type_: string;
};

type EntryDisksBackendProps = string[][];

function toFileName(path: string): string {
  return path.replace(/^.*[\\/]/, "");
}

export const requestEntries = async (
  path: string
): Promise<ENTRY_LIST_ITEM_PROPS[]> => {
  if (path.startsWith(INTERNALS_MARK)) {
    if (path === INTERNALS_HOME) {
      let disks = (await invoke("get_disk_list")) as EntryDisksBackendProps;
      return disks.flatMap((disk: string[]) => {
        return {
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
      isSelected: false,
      displayName: toFileName(entry.path),
      displayType: entry.type_ as ENTRY_TYPE,
      fullPath: entry.path,
    };
  });
};
