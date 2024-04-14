import { useEffect, useState } from "react";
import "./App.css";
import { Header, NAVIGATION_ACTION_TYPE } from "./widgets/header";
import {
  INTERNALS_HOME,
  INTERNALS_MARK,
  displayInternalPath,
} from "./shared/internals";

import { useSettings } from "./shared/settings";
import { SettingsView } from "./views/settings/ui/SettingsView";
import { Footer } from "./widgets/footer";
import { useContextMenu } from "./widgets/context-menu/useContextMenu";
import { CONTEXT_MENU_ACTION_TYPE } from "./widgets/context-menu";
import { ContextMenu } from "./widgets/context-menu/ui/ContextMenu";
import { ITEM } from "./entities/item";
import { ITEM_TYPE } from "./entities/item/model";
import {
  createDirectory,
  createTextFile,
  deleteItem,
  executeFile,
} from "./shared/api/api";
import { Sidebar } from "./widgets/sidebar/ui/Sidebar";
import { ITEM_VIEW_AS } from "./widgets/item-view/types";
import { ItemView } from "./widgets/item-view/ui/ItemView";
import { useHotkeys } from "./shared/keyboard/useHotkeys";
import { HOTKEY } from "./shared/keyboard/types";
import { useSearch } from "./shared/useSearch";
import { useSidebar } from "./widgets/sidebar/useSidebar";
import { useSelection } from "./shared/useSelection";
import { usePathQueryFilter } from "./shared/usePathQueryFilter";
import { useHistory } from "./shared/history/useHistory";
import { HISTORY_ACTION } from "./shared/history/types";

function App() {
  const [viewAs, setViewAs] = useState<ITEM_VIEW_AS>(ITEM_VIEW_AS.list);
  const { items: sidebarEntities, refreshItems: refreshSidebar } = useSidebar();
  const { close: CloseContextMenu } = useContextMenu();
  const {
    selection,
    selectionBase,
    setSelection,
    handleSelectFallthrough,
    containsPath: selectionContainsPath,
    clear: clearSelection,
  } = useSelection();
  const { settings, setSettings } = useSettings();
  const { hotkey } = useHotkeys(false);
  const { pushToHistory, getNavigationDisabledActions, popPathNavigation } =
    useHistory();
  const { path, setPath, requestPath, filtered, fromSettings } =
    usePathQueryFilter(INTERNALS_HOME);
  const { searchQuery, setSearchQuery, search, foundItems } = useSearch();

  const executeItem = (path: string, item?: ITEM) => {
    const fullPath = item ? item.path : path;
    const displayType = item ? item.type : undefined;
    if (displayType == ITEM_TYPE.directory || displayType == ITEM_TYPE.drive) {
      pushToHistory(HISTORY_ACTION.internal_open_item, item);
      return setPath(fullPath);
    }
    if (displayType == ITEM_TYPE.file) {
      pushToHistory(HISTORY_ACTION.execute_item, item);
      return executeFile(fullPath);
    }

    return executeFile(fullPath);
  };

  const handleEntryClick = (item: ITEM, multiselect: boolean) => {
    if (handleSelectFallthrough(item, multiselect)) {
      executeItem(item.path, item);
    }
  };

  const onHeaderNavigate = (type: NAVIGATION_ACTION_TYPE) => {
    switch (type) {
      case NAVIGATION_ACTION_TYPE.up:
        if (path.startsWith(INTERNALS_MARK)) {
          return;
        }
        if (path.split("\\").length - 1 == 1) {
          let newPath = path.substring(0, path.lastIndexOf("\\")) + "\\";
          if (newPath != path) {
            pushToHistory(
              HISTORY_ACTION.internal_open_item,
              undefined,
              newPath
            );
            setPath(newPath);
          } else {
            pushToHistory(
              HISTORY_ACTION.internal_open_item,
              undefined,
              INTERNALS_HOME
            );
            setPath(INTERNALS_HOME);
          }
        } else {
          pushToHistory(HISTORY_ACTION.internal_open_item, undefined, path);
          setPath((path) => {
            return path.substring(0, path.lastIndexOf("\\"));
          });
        }
        break;
      case NAVIGATION_ACTION_TYPE.back:
        setPath(popPathNavigation(path));
        break;
      case NAVIGATION_ACTION_TYPE.forward:
        break;
      case NAVIGATION_ACTION_TYPE.refresh:
        requestPath();
        break;
    }
  };

  const selectAll = () => {
    // TODO: search select
    setSelection(filtered);
  };

  const contextMenuDispatcher = (type: CONTEXT_MENU_ACTION_TYPE) => {
    switch (type) {
      case CONTEXT_MENU_ACTION_TYPE.refresh:
        requestPath();
        break;
      case CONTEXT_MENU_ACTION_TYPE.open:
        selection.forEach((entry) => {
          executeItem(entry.path, entry);
        });
        break;
      case CONTEXT_MENU_ACTION_TYPE.delete:
        selection.forEach((item) => {
          deleteItem(item.path).then(requestPath);
        });
        break;
      case CONTEXT_MENU_ACTION_TYPE.createDirectory:
        pushToHistory(HISTORY_ACTION.create_item, undefined, path);
        createDirectory(path).then(requestPath);
        break;
      case CONTEXT_MENU_ACTION_TYPE.createTextFile:
        pushToHistory(HISTORY_ACTION.create_item, undefined, path);
        createTextFile(path).then(requestPath);
        break;
      case CONTEXT_MENU_ACTION_TYPE.pin:
        setSettings({
          ...settings,
          pinned: [
            ...new Set([
              ...settings.pinned,
              ...selection
                .filter((item) => {
                  return !item.path.startsWith(INTERNALS_MARK);
                })
                .flatMap((item) => item.path),
            ]),
          ],
        });
        break;
      case CONTEXT_MENU_ACTION_TYPE.unpin:
        // TODO!: Only for one
        const bookmarkEntry = selection[0];

        setSettings({
          ...settings,
          pinned: settings.pinned.filter((path) => {
            return bookmarkEntry.path != path;
          }),
        });
        break;
      case CONTEXT_MENU_ACTION_TYPE.viewAsIcons:
        setViewAs(ITEM_VIEW_AS.icons);
        break;
      case CONTEXT_MENU_ACTION_TYPE.viewAsList:
        setViewAs(ITEM_VIEW_AS.list);
        break;
      case CONTEXT_MENU_ACTION_TYPE.selectAll:
        selectAll();
        break;
    }
    CloseContextMenu();
  };

  useEffect(() => fromSettings(settings), [settings]);
  useEffect(clearSelection, [path, filtered]);

  useEffect(() => {
    search(
      path,
      (p) => selectionContainsPath(p),
      (p) => selectionBase?.path === p,
      (p) => settings.pinned.includes(p)
    );
  }, [searchQuery]);

  useEffect(() => {
    (async () => {
      refreshSidebar(
        settings.pinned,
        (p) => selectionContainsPath(p),
        (p) => selectionBase?.path === p,
        (p) => settings.pinned.includes(p)
      );
    })();
  }, [settings, selection]);

  useEffect(() => {
    switch (hotkey) {
      case HOTKEY.refresh:
        requestPath();
        break;
      case HOTKEY.delete:
        Promise.all(
          selection.map(async (item) => await deleteItem(item.path))
        ).then(() => setSelection([]));
        break;
      case HOTKEY.enter:
        Promise.all(
          selection.map(async (item) => await executeItem(item.path, item))
        ).then(() => setSelection([]));
        break;
      case HOTKEY.selectAll:
        selectAll();
        break;
      case HOTKEY.viewAsIcons:
        setViewAs(ITEM_VIEW_AS.icons);
        break;
      case HOTKEY.viewAsList:
        setViewAs(ITEM_VIEW_AS.list);
        break;
    }
  }, [hotkey]);

  const displayEntries = searchQuery ? foundItems : filtered;
  const isInternalPage =
    path.startsWith(INTERNALS_MARK) && path !== INTERNALS_HOME;
  return (
    <>
      <ContextMenu dispatcher={contextMenuDispatcher} selection={selection} />
      <Header
        onChangePath={setPath}
        disabledActions={getNavigationDisabledActions(path)}
        fullPath={displayInternalPath(path)}
        onNavigate={onHeaderNavigate}
        onSearchInput={setSearchQuery}
      />
      <div className="app-container">
        <Sidebar
          displayIcons={settings.displayIcons}
          items={sidebarEntities}
          onClick={(item) => handleEntryClick(item, false)}
        />
        <div className="content-container">
          {isInternalPage && (
            <SettingsView
              settings={settings}
              setSettings={setSettings}
            ></SettingsView>
          )}
          {!isInternalPage && (
            <ItemView
              displayIcons={settings.displayIcons}
              items={displayEntries.flatMap((entry) => {
                return {
                  ...entry,
                  isSelected: selectionContainsPath(entry.path),
                  isBaseSelection: entry.path === selectionBase?.path,
                };
              })}
              viewAs={viewAs}
              onClick={(item) => handleEntryClick(item, true)}
            />
          )}
        </div>
      </div>
      {settings.displayFooter && (
        <Footer
          itemsCount={displayEntries.length}
          selectedCount={selection.length}
          selectionSize={selection.reduce((acc, b) => {
            return acc + (b.meta?.size ?? 0);
          }, 0)}
        />
      )}
    </>
  );
}

export default App;
