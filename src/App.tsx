import { KeyboardEvent, useEffect, useState } from "react";
import "./App.css";
import { invoke } from "@tauri-apps/api/tauri";
import { SelectionFooter } from "./selection-footer";
import { NAVIGATION_TYPE, NavigationHeader } from "./navigation-header";
import { ENTRY_LIST_ITEM_PROPS, EntryList } from "./entry-list";
import { useEntryFilteredList } from "./use-entry-filtered-list";
import { requestEntries } from "./api";
import { Sidebar } from "./sidebar";
import {
  INTERNALS_HOME,
  INTERNALS_MARK,
  displayInternalPath,
} from "./internals";
import { useHistoryNavigation } from "./use-history-navigation";

function App() {
  const [path, setPath] = useState<string>(INTERNALS_HOME);
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
  const [baseSelectedPath, setBaseSelectedPath] = useState<string | undefined>(
    undefined
  );

  const [heldButtons, setHeldButtons] = useState<string[]>([]);
  const [sidebarEntities, setSidebarEntities] = useState<
    ENTRY_LIST_ITEM_PROPS[]
  >([]);

  const { pushToHistory, getNavigationDisabledActions, popPathNavigation } =
    useHistoryNavigation();
  const { setEntries, filteredEntries } = useEntryFilteredList();

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
        if (entry.displayType == "dir" || entry.displayType == "disk") {
          pushToHistory("open_entry", entry);
          return setPath(entry.fullPath);
        }
        if (entry.displayType == "file") {
          pushToHistory("execute_file", entry);
          return invoke("execute_file", { path: entry.fullPath });
        }
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
        requestEntries(path).then((res) => {
          setEntries(res);
        });
        break;
    }
  };

  // Request on change path
  useEffect(() => {
    (async () => {
      setEntries(await requestEntries(path));
    })();
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
          isBaseSelection: false,
          isSelected: selectedPaths.includes(INTERNALS_HOME),
          displayName: displayInternalPath(INTERNALS_HOME),
          displayType: "dir",
          fullPath: INTERNALS_HOME,
        },
        ...(await requestEntries(INTERNALS_HOME)),
      ]);
    })();
  }, [path]);

  useEffect(() => {
    const handledKeys = ["Control", "Shift", "a"];
    const keyDownHandler = (event: any) => {
      if (handledKeys.includes(event.key)) {
        event.preventDefault();
        if (heldButtons.includes(event.key)) {
          return;
        }
        setHeldButtons((prev) => {
          return [...prev, event.key];
        });
      }
    };

    const keyUpHandler = (event: any) => {
      if (handledKeys.includes(event.key)) {
        event.preventDefault();
        setHeldButtons((prev) => {
          return prev.filter((key) => {
            return key != event.key;
          }, prev);
        });
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keydown", keyUpHandler);
    };
  }, []);

  useEffect(() => {
    const mouseUpHandle = (event: MouseEvent) => {
      let className = (event.target as HTMLButtonElement | undefined)
        ?.className;
      if (className === "app-container") {
        event.stopPropagation();
        setSelectedPaths([]);
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
