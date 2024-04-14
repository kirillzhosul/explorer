import { invoke } from "@tauri-apps/api";
import { INTERNALS_MARK } from "../internals";
import { ITEM_API_DTO } from "./types";

export const getItemInfo = async (path: string): Promise<ITEM_API_DTO> => {
  if (path.startsWith(INTERNALS_MARK)) {
    throw Error("Tried to handle internal path that is forbidden to request!");
  }
  return await invoke("get_item_info", {
    path,
  });
};

export const deleteItem = async (path: string): Promise<string> => {
  if (path.startsWith(INTERNALS_MARK)) {
    throw Error("Tried to handle internal path that is forbidden to request!");
  }
  return await invoke("delete_item", {
    path,
  });
};

export const createTextFile = async (
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

export const createDirectory = async (
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

export const executeFile = async (path: string): Promise<undefined> => {
  if (path.startsWith(INTERNALS_MARK)) {
    throw Error("Tried to handle internal path that is forbidden to request!");
  }
  return await invoke("execute_file", {
    path,
  });
};

export const getDiskList = async (): Promise<string[][]> => {
  // TODO: typed api
  return await invoke("get_disk_list");
};

export const listDirectory = async (path: string): Promise<ITEM_API_DTO[]> => {
  if (path.startsWith(INTERNALS_MARK)) {
    throw Error("Tried to handle internal path that is forbidden to request!");
  }
  return await invoke("list_directory", {
    path,
  });
};

export const searchGlob = async (
  pathWithPattern: string
): Promise<ITEM_API_DTO[]> => {
  if (pathWithPattern.startsWith(INTERNALS_MARK)) {
    throw Error("Tried to handle internal path that is forbidden to request!");
  }
  return await invoke("search_glob", {
    pathWithPattern,
  });
};
