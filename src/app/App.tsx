import {
  INTERNALS_HOME,
  INTERNALS_MARK
} from "@@shared/lib/internals";
import { useEffect } from "react";
import { Header } from "../widgets/header";
import styles from "./App.module.css";

import { ITEM } from "@@entities/item";
import { ITEM_TYPE } from "@@entities/item/model";
import { useSettings } from "@@shared/settings";
import { createDirectory, createTextFile, deleteItem, executeFile } from "@api";
import { SettingsView } from "../views/settings/ui/SettingsView";
import { CONTEXT_MENU_ACTION_TYPE } from "../widgets/context-menu";
import { ContextMenu } from "../widgets/context-menu/ui/ContextMenu";
import { useContextMenu } from "../widgets/context-menu/useContextMenu";
import { Footer } from "../widgets/footer";
import { ITEM_VIEW_AS } from "../widgets/item-view/types";
import { ItemView } from "../widgets/item-view/ui/ItemView";
import { Sidebar } from "../widgets/sidebar/ui/Sidebar";

import { navigationDispatcher } from "@@shared/dispatchers/navigationDispatcher";
import { HISTORY_ACTION } from "@@shared/hooks/history/types";
import { useHistory } from "@@shared/hooks/history/useHistory";
import { HOTKEY } from "@@shared/hooks/keyboard/types";
import { useHotkeys } from "@@shared/hooks/keyboard/useHotkeys";
import { usePathQueryFilter } from "@@shared/hooks/usePathQueryFilter";
import { useSearch } from "@@shared/hooks/useSearch";
import { useSelection } from "@@shared/hooks/useSelection";
import { isTauriIPCSupported, TauriIPCMissing } from "@@widgets/tauriMissingIPC";
import { useSidebar } from "../widgets/sidebar/useSidebar";


export function App() {
  if (!isTauriIPCSupported()) return <TauriIPCMissing />

  const sidebar = useSidebar();
  const contextMenu = useContextMenu();
  const hotkeys = useHotkeys(false);
  const settings = useSettings();
  const history = useHistory();
  const selection = useSelection();
  const search = useSearch();
  const q = usePathQueryFilter(INTERNALS_HOME);

  const executeItem = (item: ITEM) => {
    if (item.type == ITEM_TYPE.directory || item.type == ITEM_TYPE.drive) {
      history.push(HISTORY_ACTION.internal_open_item, item);
      return q.setPath(item.path);
    }
    if (item.type == ITEM_TYPE.file) {
      history.push(HISTORY_ACTION.execute_item, item);
      return executeFile(item.path);
    }

    return executeFile(item.path);
  };

  const contextMenuDispatcher = (type: CONTEXT_MENU_ACTION_TYPE) => {
    switch (type) {
      case CONTEXT_MENU_ACTION_TYPE.refresh:
        q.requestPath();
        break;
      case CONTEXT_MENU_ACTION_TYPE.open:
        selection.items.forEach((entry) => {
          executeItem(entry);
        });
        break;
      case CONTEXT_MENU_ACTION_TYPE.delete:
        selection.items.forEach((item) => {
          deleteItem(item.path).then(q.requestPath);
        });
        break;
      case CONTEXT_MENU_ACTION_TYPE.createDirectory:
        history.push(HISTORY_ACTION.create_item, undefined, q.path);
        createDirectory(q.path).then(q.requestPath);
        break;
      case CONTEXT_MENU_ACTION_TYPE.createTextFile:
        history.push(HISTORY_ACTION.create_item, undefined, q.path);
        createTextFile(q.path).then(q.requestPath);
        break;
      case CONTEXT_MENU_ACTION_TYPE.pin:
        settings.setSettings({
          ...settings.settings,
          pinned: [
            ...new Set([
              ...settings.settings.pinned,
              ...selection.items
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
        const bookmarkItem = selection.items[0];

        settings.setSettings({
          ...settings.settings,
          pinned: settings.settings.pinned.filter((path) => {
            return bookmarkItem.path != path;
          }),
        });
        break;
      case CONTEXT_MENU_ACTION_TYPE.viewAsIcons:
        settings.setSettings({
          ...settings.settings,
          viewAs: ITEM_VIEW_AS.icons,
        });
        break;
      case CONTEXT_MENU_ACTION_TYPE.viewAsList:
        settings.setSettings({
          ...settings.settings,
          viewAs: ITEM_VIEW_AS.list,
        });
        break;
      case CONTEXT_MENU_ACTION_TYPE.selectAll:
        selection.setSelection(q.filtered);
        break;
    }
    contextMenu.close();
  };

  useEffect(() => q.fromSettings(settings.settings), [settings.settings]);
  useEffect(selection.clear, [q.path, q.filtered]);

  useEffect(() => {
    search.search(
      q.path,
      (p) => selection.containsPath(p),
      (p) => selection.selectionBase?.path === p,
      (p) => settings.settings.pinned.includes(p)
    );
  }, [search.searchQuery]);

  useEffect(() => {
    (async () => {
      sidebar.refresh(
        settings.settings.pinned,
        (p) => selection.containsPath(p),
        (p) => selection.selectionBase?.path === p,
        (p) => settings.settings.pinned.includes(p)
      );
    })();
  }, [settings.settings, selection.items]);

  useEffect(() => {
    switch (hotkeys.hotkey) {
      case HOTKEY.refresh:
        q.requestPath();
        break;
      case HOTKEY.delete:
        Promise.all(
          selection.items.map(async (item) => await deleteItem(item.path))
        ).then(() => selection.setSelection([]));
        break;
      case HOTKEY.enter:
        Promise.all(
          selection.items.map(async (item) => await executeItem(item))
        ).then(() => selection.setSelection([]));
        break;
      case HOTKEY.selectAll:
        selection.setSelection(q.filtered);
        break;
      case HOTKEY.viewAsIcons:
        settings.setSettings({
          ...settings.settings,
          viewAs: ITEM_VIEW_AS.icons,
        });
        break;
      case HOTKEY.viewAsList:
        settings.setSettings({
          ...settings.settings,
          viewAs: ITEM_VIEW_AS.list,
        });
        break;
    }
  }, [hotkeys.hotkey]);

  const displayEntries = search.searchQuery ? search.foundItems : q.filtered;
  const isInternalPage =
    q.path.startsWith(INTERNALS_MARK) && q.path !== INTERNALS_HOME;
  return (
    <>
      <ContextMenu
        dispatcher={contextMenuDispatcher}
        selection={selection.items}
      />
      <Header
        onChangePath={q.setPath}
        disabledActions={history.getNavigationDisabledActions(q.path)}
        fullPath={q.path}
        onSearchInput={search.setSearchQuery}
        onNavigate={(type) =>
          navigationDispatcher(
            type,
            q.path,
            history.push,
            q.setPath,
            history.popPathNavigation,
            q.requestPath
          )
        }
      />
      <div className={styles.app} id="app-container">
        <Sidebar
          displayIcons={settings.settings.displayIcons}
          items={sidebar.items}
          onClick={(item, rmb) =>
            selection.handleSelectWithCallback(
              displayEntries,
              item,
              false,
              executeItem,
              rmb
            )
          }
        />
        <div className={styles.container}>
          {isInternalPage && (
            <SettingsView
              settings={settings.settings}
              setSettings={settings.setSettings}
            ></SettingsView>
          )}
          {!isInternalPage && (
            <>
              {q.error && (
                <div
                  style={{
                    color: "red",
                  }}
                >
                  {q.error}
                </div>
              )}

              {!q.error && (
                <ItemView
                  displayIcons={settings.settings.displayIcons}
                  items={displayEntries.flatMap((item): ITEM => {
                    return {
                      ...item,
                      flags: {
                        ...item.flags,
                        selection: selection.containsPath(item.path),
                        baseSelection:
                          item.path === selection.selectionBase?.path,
                      },
                    };
                  })}
                  viewAs={settings.settings.viewAs}
                  onClick={(item, rmb) =>
                    selection.handleSelectWithCallback(
                      displayEntries,
                      item,
                      true,
                      executeItem,
                      rmb
                    )
                  }
                />
              )}
            </>
          )}
        </div>
      </div>
      {settings.settings.displayFooter && (
        <Footer
          itemsCount={displayEntries.length}
          selectedCount={selection.items.length}
          selectionSize={selection.items.reduce((acc, b) => {
            return acc + (b.meta?.size ?? 0);
          }, 0)}
        />
      )}
    </>
  );
}
