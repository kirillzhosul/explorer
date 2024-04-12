import { useEffect, useState } from "react";
import "./App.css";
import { invoke } from "@tauri-apps/api/tauri";
import { SelectionFooter } from "./selection-footer";
import { NAVIGATION_TYPE, NavigationHeader } from "./navigation-header";
import {
  ENTRY_LIST_ITEM_PROPS,
  ENTRY_LIST_VIEW_AS,
  EntryList,
} from "./entry-list";
import { useEntryFilteredList } from "./use-entry-filtered-list";
import {
  getItemInfo,
  createDirectory,
  createTextFile,
  requestEntries,
  deleteItem,
} from "./api";
import { Sidebar } from "./sidebar";
import {
  INTERNALS_HOME,
  INTERNALS_MARK,
  INTERNALS_SETTINGS,
  displayInternalPath,
} from "./internals";
import { useHistoryNavigation } from "./use-history-navigation";
import { useKeyboardHandler } from "./use-keyboard-handler";
import { useContextMenu } from "./use-context-menu";
import { CONTEXT_MENU_DISPATCH_TYPE, ContextMenu } from "./context-menu";
import { useSettingsStorage } from "./settings-storage";
import { SettingsView } from "./settings-view";
import { parseWindowsAttributes } from "./attributes";

function App() {
  const [path, setPath] = useState<string>(INTERNALS_HOME);
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
  const [selectionEntries, setSelectionEntries] = useState<
    ENTRY_LIST_ITEM_PROPS[]
  >([]);
  const [viewAs, setViewAs] = useState<ENTRY_LIST_VIEW_AS>("list");

  const [baseSelectedPath, setBaseSelectedPath] = useState<string | undefined>(
    undefined
  );
  const [sidebarEntities, setSidebarEntities] = useState<
    ENTRY_LIST_ITEM_PROPS[]
  >([]);

  const { close: CloseContextMenu } = useContextMenu();
  const { settings, setSettings } = useSettingsStorage();
  const { heldButtons } = useKeyboardHandler();
  const { pushToHistory, getNavigationDisabledActions, popPathNavigation } =
    useHistoryNavigation();
  const { setEntries, filteredEntries, setFilters } = useEntryFilteredList();

  const executeEntry = (path: string, entry?: ENTRY_LIST_ITEM_PROPS) => {
    const fullPath = entry ? entry.fullPath : path;
    const displayType = entry ? entry.displayType : "any";
    if (displayType == "dir" || displayType == "disk") {
      pushToHistory("open_entry", entry);
      return setPath(fullPath);
    }
    if (displayType == "file") {
      pushToHistory("execute_file", entry);
      return invoke("execute_file", { path: fullPath });
    }

    return invoke("execute_file", { path: fullPath });
  };

  const handleEntryClick = (
    _: any,
    entry: ENTRY_LIST_ITEM_PROPS,
    behavior: "sidebar-behavior" | "default-behavior"
  ) => {
    if (
      entry.fullPath.startsWith(INTERNALS_MARK) &&
      ![INTERNALS_HOME, INTERNALS_SETTINGS].includes(entry.fullPath)
    ) {
      throw Error("Tried to handle internal path");
    }
    if (selectedPaths.includes(entry.fullPath)) {
      if (heldButtons.includes("Shift")) {
        return;
      }
      if (heldButtons.includes("Control")) {
        setSelectedPaths((prev) => {
          return prev.filter((prev_path) => {
            return prev_path != entry.fullPath;
          });
        });
      } else {
        if (selectedPaths.length > 1) {
          setSelectedPaths([entry.fullPath]);
          return;
        }
        executeEntry(entry.fullPath, entry);
      }
    } else if (heldButtons.includes("Shift")) {
    } else if (
      behavior !== "sidebar-behavior" &&
      heldButtons.includes("Control")
    ) {
      if (baseSelectedPath === undefined) {
        setBaseSelectedPath(entry.fullPath);
      }
      setSelectedPaths((prev) => {
        return [...prev, entry.fullPath];
      });
    } else {
      if (behavior !== "sidebar-behavior") {
        setBaseSelectedPath(entry.fullPath);
      }
      setSelectedPaths([entry.fullPath]);
    }
  };

  const onHeaderNavigate = (_: any, type: NAVIGATION_TYPE) => {
    switch (type) {
      case "above":
        if (path.startsWith(INTERNALS_MARK)) {
          return;
        }
        if (path.split("\\").length - 1 == 1) {
          let newPath = path.substring(0, path.lastIndexOf("\\")) + "\\";
          if (newPath != path) {
            pushToHistory("open_entry", undefined, newPath);
            setPath(newPath);
          } else {
            pushToHistory("open_entry", undefined, INTERNALS_HOME);
            setPath(INTERNALS_HOME);
          }
        } else {
          pushToHistory("open_entry", undefined, path);
          setPath((path) => {
            return path.substring(0, path.lastIndexOf("\\"));
          });
        }
        break;
      case "back":
        setPath(popPathNavigation(path));
        break;
      case "forward":
        break;
      case "reload":
        reloadEntriesFromApi(path);
        break;
    }
  };

  const reloadEntriesFromApi = (path: string) => {
    requestEntries(path)
      .then(setEntries)
      .catch((err) => {
        console.log(err);
      });
  };

  const selectAll = () => {
    setSelectedPaths(
      filteredEntries.flatMap((entry) => {
        return entry.fullPath;
      })
    );
  };
  const contextMenuDispatcher = (type: CONTEXT_MENU_DISPATCH_TYPE) => {
    switch (type) {
      case "refresh":
        reloadEntriesFromApi(path);
        break;
      case "open":
        selectedPaths.map((path) => {
          executeEntry(path);
        });
        break;
      case "delete":
        selectedPaths.forEach((path) => {
          deleteItem(path)
            .then(() => reloadEntriesFromApi(path))
            .catch(() => {});
        });
        break;
      case "create-folder":
        createDirectory(path, "New Folder")
          .then(() => reloadEntriesFromApi(path))
          .catch(() => {});
        break;
      case "create-text-file":
        createTextFile(path, "New File.txt")
          .then(() => reloadEntriesFromApi(path))
          .catch(() => {});
        break;
      case "bookmark":
        setSettings({
          ...settings,
          bookmarkedPaths: [
            ...new Set([
              ...settings.bookmarkedPaths,
              ...selectedPaths.filter((path) => {
                return !path.startsWith(INTERNALS_MARK);
              }),
            ]),
          ],
        });
        break;
      case "remove-bookmark":
        const bookmarkEntry = selectionEntries[0];

        setSettings({
          ...settings,
          bookmarkedPaths: settings.bookmarkedPaths.filter((path) => {
            return bookmarkEntry.fullPath != path;
          }),
        });
        break;
      case "view-as-icons":
        setViewAs("icons");
        break;
      case "view-as-list":
        setViewAs("list");
        break;
      case "view-as-details":
        setViewAs("details");
        break;
      case "select-all":
        selectAll();
        break;
    }
    CloseContextMenu();
  };

  const selectionAsEntries = async (): Promise<ENTRY_LIST_ITEM_PROPS[]> => {
    return await Promise.all(
      selectedPaths.map(async (path) => {
        if (path.startsWith(INTERNALS_MARK)) {
          return {
            isBookmarked: false,
            isBaseSelection: baseSelectedPath === path,
            isSelected: selectedPaths.includes(path),
            displayName: displayBaseNameFromPath(path),
            displayType: "dir",
            fullPath: path,
          } as ENTRY_LIST_ITEM_PROPS;
        }
        let itemInfo = await getItemInfo(path);

        return {
          isBookmarked: settings.bookmarkedPaths.includes(itemInfo.path),
          isBaseSelection: baseSelectedPath === itemInfo.path,
          isSelected: selectedPaths.includes(itemInfo.path),
          displayName: displayBaseNameFromPath(itemInfo.path),
          displayType: itemInfo.type_,
          fullPath: itemInfo.path,
          metadata: {
            readonly: itemInfo.readonly,
            attributes: {
              windows: parseWindowsAttributes(itemInfo.attributes.windows),
              linux: undefined,
            },
            fileSize: itemInfo.file_size,
          },
        } as ENTRY_LIST_ITEM_PROPS;
      })
    );
  };

  const displayBaseNameFromPath = (path: string) => {
    return path.split("\\").pop();
  };

  // Request on change path
  useEffect(() => {
    reloadEntriesFromApi(path);
  }, [path]);

  useEffect(() => {
    setFilters({
      hideDotFiles: settings.hideDottedFiles,
      hideSystem: settings.hideSystem,
      hideHidden: settings.hideHidden,
    });
  }, [settings]);

  // Deselect
  useEffect(() => {
    setSelectedPaths([]);
    setBaseSelectedPath(undefined);
  }, [path, filteredEntries]);

  useEffect(() => {
    (async () => {
      setSidebarEntities([
        // TODO: Uncaught error
        ...(await requestEntries(INTERNALS_HOME)).map((e: any) => {
          return { ...e, isSelected: selectedPaths.includes(e.fullPath) };
        }),
        ...(await Promise.all(
          settings.bookmarkedPaths
            .map(async (path) => {
              try {
                let itemInfo = await getItemInfo(path);

                return {
                  isBookmarked: true,
                  isBaseSelection: baseSelectedPath === itemInfo.path,
                  isSelected: selectedPaths.includes(itemInfo.path),
                  displayName: displayBaseNameFromPath(itemInfo.path),
                  displayType: itemInfo.type_,
                  fullPath: itemInfo.path,
                };
              } catch {
                return;
              }
            })
            .filter((entry) => entry !== undefined)
        )),
        {
          isBaseSelection: baseSelectedPath === INTERNALS_HOME,
          isSelected: selectedPaths.includes(INTERNALS_HOME),
          displayName: displayInternalPath(INTERNALS_HOME),
          displayType: "dir",
          fullPath: INTERNALS_HOME,
          isBookmarked: false,
        },
        {
          isBaseSelection: baseSelectedPath === INTERNALS_SETTINGS,
          isSelected: selectedPaths.includes(INTERNALS_SETTINGS),
          displayName: displayInternalPath(INTERNALS_SETTINGS),
          displayType: "dir",
          fullPath: INTERNALS_SETTINGS,
          isBookmarked: false,
        },
      ]);
    })();
  }, [settings, selectedPaths]);

  useEffect(() => {
    const mouseUpHandle = (event: MouseEvent) => {
      let className = (event.target as HTMLButtonElement | undefined)
        ?.className;
      let id = (event.target as HTMLButtonElement | undefined)?.id;
      if (className === "app-container") {
        setSelectedPaths([]);
      }
      if (className !== "context-menu-button" && id !== "context-menu") {
        event.stopPropagation();
        CloseContextMenu();
      }
    };
    document.addEventListener("mouseup", mouseUpHandle);
    return () => {
      document.removeEventListener("mouseup", mouseUpHandle);
    };
  }, []);

  useEffect(() => {
    if (heldButtons.includes("Enter")) {
      Promise.all(
        selectedPaths.map(async (path) => await executeEntry(path))
      ).then(() => setSelectedPaths([]));
    } else if (heldButtons.includes("Delete")) {
      Promise.all(
        selectedPaths.map(async (path) => await deleteItem(path))
      ).then(() => setSelectedPaths([]));
    }
    if (heldButtons.includes("Control")) {
      if (heldButtons.includes("F5")) {
        reloadEntriesFromApi(path);
      } else if (heldButtons.includes("a")) {
        selectAll();
      } else if (heldButtons.includes("Shift")) {
        if (heldButtons.includes("!")) {
          setViewAs("icons");
        }
        if (heldButtons.includes("@")) {
          setViewAs("list");
        }
        if (heldButtons.includes("#")) {
          setViewAs("details");
        }
      }
    }
    CloseContextMenu();
  }, [heldButtons]);

  useEffect(() => {
    (async () => {
      setSelectionEntries(await selectionAsEntries());
    })();
  }, [selectedPaths, settings]);

  //console.log(selectionEntries);
  const isInternalPage =
    path.startsWith(INTERNALS_MARK) && path !== INTERNALS_HOME;
  return (
    <>
      <ContextMenu
        dispatcher={contextMenuDispatcher}
        selectionEntries={selectionEntries}
      />
      <NavigationHeader
        disabledActions={getNavigationDisabledActions(path)}
        path={displayInternalPath(path)}
        onNavigate={onHeaderNavigate}
      />
      <div className="app-container">
        <Sidebar
          settings={settings}
          entries={sidebarEntities}
          onClick={(e, entry) => handleEntryClick(e, entry, "sidebar-behavior")}
        />
        <div className="content-container">
          {isInternalPage && (
            <SettingsView
              settings={settings}
              setSettings={setSettings}
            ></SettingsView>
          )}
          {!isInternalPage && (
            <EntryList
              settings={settings}
              entries={filteredEntries.flatMap((entry) => {
                return {
                  ...entry,
                  isSelected: selectedPaths.includes(entry.fullPath),
                  isBaseSelection: entry.fullPath === baseSelectedPath,
                };
              })}
              viewAs={viewAs}
              onClick={(e, entry) =>
                handleEntryClick(e, entry, "default-behavior")
              }
            />
          )}
        </div>
      </div>
      {settings.displayFooter && (
        <SelectionFooter
          itemsCount={filteredEntries.length}
          selectedCount={selectedPaths.length}
          selectionSize={selectionEntries.reduce((acc, b) => {
            return acc + (b.metadata?.fileSize ?? 0);
          }, 0)}
        />
      )}
    </>
  );
}

export default App;
