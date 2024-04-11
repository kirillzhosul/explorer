import { useEffect, useState } from "react";
import "./App.css";
import { invoke } from "@tauri-apps/api/tauri";
import { SelectionFooter } from "./footer/selection-footer";
import { NavigationHeader } from "./header/navigation-header";
import { ENTRY_LIST_ITEM_PROPS, EntryList } from "./entry/entry-list";
import { useEntryFilteredList } from "./entry/entry-filter-hook";
import { requestEntries } from "./api/invoker";
import { Sidebar } from "./sidebar/sidebar";
import { INTERNALS_HOME, INTERNALS_MARK } from "./internals/const";

function App() {
  const [path, setPath] = useState<string>(INTERNALS_HOME);
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
  const [sidebarEntities, setSidebarEntities] = useState<
    ENTRY_LIST_ITEM_PROPS[]
  >([]);
  const { setEntries, filteredEntries } = useEntryFilteredList();

  const unwrapInternalPath = (path: string): string => {
    if (path === INTERNALS_HOME) {
      return "This PC";
    }

    return path;
  };
  const handleEntryClick = (_: any, entry: ENTRY_LIST_ITEM_PROPS) => {
    if (
      entry.fullPath.startsWith(INTERNALS_MARK) &&
      entry.fullPath !== INTERNALS_HOME
    ) {
      throw Error("Tried to handle internal path");
    }
    if (selectedPaths.includes(entry.fullPath)) {
      if (entry.displayType == "dir" || entry.displayType == "disk") {
        return setPath(entry.fullPath);
      }
      if (entry.displayType == "file") {
        return invoke("execute_file", { path: entry.fullPath });
      }
    } else {
      setSelectedPaths([entry.fullPath]);
    }
  };

  useEffect(() => {
    (async () => {
      setEntries(await requestEntries(path));
    })();
  }, [path]);

  useEffect(() => {
    setSelectedPaths([]);
  }, [path, filteredEntries]);

  useEffect(() => {
    (async () => {
      setSidebarEntities([
        {
          isSelected: selectedPaths.includes(INTERNALS_HOME),
          displayName: unwrapInternalPath(INTERNALS_HOME),
          displayType: "dir",
          fullPath: INTERNALS_HOME,
        },
        ...(await requestEntries(INTERNALS_HOME)),
      ]);
    })();
  }, [path]);

  return (
    <>
      <NavigationHeader path={unwrapInternalPath(path)} />
      <div className="app-container">
        <Sidebar entries={sidebarEntities} onClick={handleEntryClick} />
        <div className="content-container">
          <EntryList
            entries={filteredEntries.flatMap((entry) => {
              return {
                ...entry,
                isSelected: selectedPaths.includes(entry.fullPath),
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
