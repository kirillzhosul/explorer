import { INTERNALS_MARK } from "@@shared/lib/internals";
import { invoke } from "@tauri-apps/api";
import { ITEM_API_DTO } from "./types";

interface BackendProvider {
  /**
   * Provider protocol for internal backend calls.
   */

  /**
   * Acquire information about entry (file / directory) by its path
   */
  getItemInfo(path: string): Promise<ITEM_API_DTO>;
  deleteItem(path: string): Promise<string>;
  createTextFile(path: string, name: string): Promise<string>;
  createDirectory(path: string, name: string): Promise<string>;
  executeFile(path: string): Promise<undefined>;
  getDiskList(): Promise<string[][]>;
  listDirectory(path: string): Promise<ITEM_API_DTO[]>;
  searchGlob(pathWithPattern: string): Promise<ITEM_API_DTO[]>;
}

class IPCBackendProvider implements BackendProvider {
  async getItemInfo(path: string): Promise<ITEM_API_DTO> {
    if (path.startsWith(INTERNALS_MARK)) {
      throw Error(
        "Tried to handle internal path that is forbidden to request!"
      );
    }
    return await invoke("get_item_info", {
      path,
    });
  }

  async deleteItem(path: string): Promise<string> {
    if (path.startsWith(INTERNALS_MARK)) {
      throw Error(
        "Tried to handle internal path that is forbidden to request!"
      );
    }
    return await invoke("delete_item", {
      path,
    });
  }

  async createTextFile(path: string, name: string): Promise<string> {
    if (path.startsWith(INTERNALS_MARK)) {
      throw Error(
        "Tried to handle internal path that is forbidden to request!"
      );
    }

    return await invoke("create_text_file", {
      path,
      name,
    });
  }

  async createDirectory(
    path: string,
    name: string = "New folder"
  ): Promise<string> {
    if (path.startsWith(INTERNALS_MARK)) {
      throw Error(
        "Tried to handle internal path that is forbidden to request!"
      );
    }
    return await invoke("create_directory", {
      path,
      name,
    });
  }

  async executeFile(path: string): Promise<undefined> {
    if (path.startsWith(INTERNALS_MARK)) {
      throw Error(
        "Tried to handle internal path that is forbidden to request!"
      );
    }
    return await invoke("execute_file", {
      path,
    });
  }

  async getDiskList(): Promise<string[][]> {
    // TODO: typed api
    return await invoke("get_disk_list");
  }

  async listDirectory(path: string): Promise<ITEM_API_DTO[]> {
    if (path.startsWith(INTERNALS_MARK)) {
      throw Error(
        "Tried to handle internal path that is forbidden to request!"
      );
    }
    return await invoke("list_directory", {
      path,
    });
  }

  async searchGlob(pathWithPattern: string): Promise<ITEM_API_DTO[]> {
    if (pathWithPattern.startsWith(INTERNALS_MARK)) {
      throw Error(
        "Tried to handle internal path that is forbidden to request!"
      );
    }
    return await invoke("search_glob", {
      pathWithPattern,
      recurse: false,
    });
  }
}

function getBackendProvider(): BackendProvider {
  return new IPCBackendProvider();
}

export { getBackendProvider };
