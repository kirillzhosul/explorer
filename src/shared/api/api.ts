import { INTERNALS_MARK } from "@@shared/lib/internals";
import { invoke } from "@tauri-apps/api";
import { INITIAL_PARAMS, ITEM_API_DTO } from "./types";

const getItemInfo = async (path: string): Promise<ITEM_API_DTO> => {
  if (path.startsWith(INTERNALS_MARK)) {
    throw Error("Tried to handle internal path that is forbidden to request!");
  }
  return await invoke("get_item_info", {
    path,
  });
};

const queryInitialParams = async (): Promise<INITIAL_PARAMS> => {
  return await invoke("query_initial_params", {});
};

const deleteItem = async (path: string): Promise<string> => {
  if (path.startsWith(INTERNALS_MARK)) {
    throw Error("Tried to handle internal path that is forbidden to request!");
  }
  return await invoke("delete_item", {
    path,
  });
};

const createTextFile = async (
  path: string,
  name: string = "New file.txt"
): Promise<string> => {
  if (path.startsWith(INTERNALS_MARK)) {
    throw Error("Tried to handle internal path that is forbidden to request!");
  }

  return await invoke("create_text_file", {
    path,
    name,
  });
};

const createDirectory = async (
  path: string,
  name: string = "New folder"
): Promise<string> => {
  if (path.startsWith(INTERNALS_MARK)) {
    throw Error("Tried to handle internal path that is forbidden to request!");
  }
  return await invoke("create_directory", {
    path,
    name,
  });
};

const executeFile = async (path: string): Promise<undefined> => {
  if (path.startsWith(INTERNALS_MARK)) {
    throw Error("Tried to handle internal path that is forbidden to request!");
  }
  return await invoke("execute_file", {
    path,
  });
};

const getDiskList = async (): Promise<string[][]> => {
  // TODO: typed api
  return await invoke("get_disk_list");
};

const listDirectory = async (path: string): Promise<ITEM_API_DTO[]> => {
  if (path.startsWith(INTERNALS_MARK)) {
    throw Error("Tried to handle internal path that is forbidden to request!");
  }
  return await invoke("list_directory", {
    path,
  });
};

const searchGlob = async (pathWithPattern: string): Promise<ITEM_API_DTO[]> => {
  if (pathWithPattern.startsWith(INTERNALS_MARK)) {
    throw Error("Tried to handle internal path that is forbidden to request!");
  }
  return await invoke("search_glob", {
    pathWithPattern,
    recurse: false,
  });
};

export {
  createDirectory,
  createTextFile,
  deleteItem,
  executeFile,
  getDiskList,
  getItemInfo,
  listDirectory,
  queryInitialParams,
  searchGlob,
};
