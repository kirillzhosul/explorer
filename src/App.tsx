import { useEffect, useState } from "react";
import "./App.css";
import { invoke } from "@tauri-apps/api/tauri";
import { SelectionFooter } from "./selection-footer";
import { NAVIGATION_TYPE, NavigationHeader } from "./navigation-header";
import { ENTRY_LIST_ITEM_PROPS, EntryList } from "./entry-list";
import { useEntryFilteredList } from "./use-entry-filtered-list";
import { getItemInfo, openTerminalInDirectory, requestEntries } from "./api";
import { Sidebar } from "./sidebar";
import {
  INTERNALS_HOME,
  INTERNALS_MARK,
  displayInternalPath,
} from "./internals";
import { useHistoryNavigation } from "./use-history-navigation";
import { useKeyboardHandler } from "./use-keyboard-handler";
import { useContextMenu } from "./use-context-menu";
import { CONTEXT_MENU_DISPATCH_TYPE, ContextMenu } from "./context-menu";
import { useSettingsStorage } from "./settings-storage";

function App() {
  const [path, setPath] = useState<string>(INTERNALS_HOME);
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);

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
  const { setEntries, filteredEntries } = useEntryFilteredList();

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

  const handleEntryClick = (_: any, entry: ENTRY_LIST_ITEM_PROPS) => {
    if (
      entry.fullPath.startsWith(INTERNALS_MARK) &&
      entry.fullPath !== INTERNALS_HOME
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
    } else if (heldButtons.includes("Control")) {
      if (baseSelectedPath === undefined) {
        setBaseSelectedPath(entry.fullPath);
      }
      setSelectedPaths((prev) => {
        return [...prev, entry.fullPath];
      });
    } else {
      setBaseSelectedPath(entry.fullPath);
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

  const contextMenuDispatcher = (type: CONTEXT_MENU_DISPATCH_TYPE) => {
    switch (type) {
      case "refresh":
        reloadEntriesFromApi(path);
        break;
      case "open-terminal-here":
        openTerminalInDirectory(path).then();
        break;
      case "open":
        selectedPaths.map((path) => {
          executeEntry(path);
        });
        break;
      case "delete":
        break;
      case "create-folder":
        break;
      case "create-text-file":
        break;
      case "bookmark":
        setSettings({
          bookmarkedPaths: [
            ...new Set([...settings.bookmarkedPaths, ...selectedPaths]),
          ],
        });
        break;
    }
    CloseContextMenu();
  };
  const displayBaseNameFromPath = (path: string) => {
    return path.split("\\").pop();
  };
  // Request on change path
  useEffect(() => {
    reloadEntriesFromApi(path);
  }, [path]);

  // Deselect
  useEffect(() => {
    setSelectedPaths([]);
    setBaseSelectedPath(undefined);
  }, [path, filteredEntries]);

  useEffect(() => {
    (async () => {
      setSidebarEntities([
        {
          isBaseSelection: baseSelectedPath === INTERNALS_HOME,
          isSelected: selectedPaths.includes(INTERNALS_HOME),
          displayName: displayInternalPath(INTERNALS_HOME),
          displayType: "dir",
          fullPath: INTERNALS_HOME,
        },
        // TODO: Uncaught error
        ...(await requestEntries(INTERNALS_HOME)).map((e: any) => {
          return { ...e, isSelected: selectedPaths.includes(e.fullPath) };
        }),
        ...(await Promise.all(
          settings.bookmarkedPaths.map(async (path) => {
            let itemInfo = await getItemInfo(path);

            return {
              isBookmarked: true,
              isBaseSelection: baseSelectedPath === itemInfo.path,
              isSelected: selectedPaths.includes(itemInfo.path),
              displayName: displayBaseNameFromPath(itemInfo.path),
              displayType: itemInfo.type_,
              fullPath: itemInfo.path,
            };
          })
        )),
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
    if (heldButtons.includes("a") && heldButtons.includes("Control")) {
      setSelectedPaths(
        filteredEntries.flatMap((entry) => {
          return entry.fullPath;
        })
      );
    }
  }, [heldButtons]);
  return (
    <>
      <ContextMenu
        dispatcher={contextMenuDispatcher}
        selectionExists={selectedPaths.length != 0}
      />
      <NavigationHeader
        disabledActions={getNavigationDisabledActions(path)}
        path={displayInternalPath(path)}
        onNavigate={onHeaderNavigate}
      />
      <div className="app-container">
        <Sidebar entries={sidebarEntities} onClick={handleEntryClick} />
        <div className="content-container">
          <EntryList
            entries={filteredEntries.flatMap((entry) => {
              return {
                ...entry,
                isSelected: selectedPaths.includes(entry.fullPath),
                isBaseSelection: entry.fullPath === baseSelectedPath,
              };
            })}
            onClick={handleEntryClick}
          />
        </div>
      </div>
      <SelectionFooter
        itemsCount={filteredEntries.length}
        selectedCount={selectedPaths.length}
      />
    </>
  );
}

export default App;
