import { ReactNode } from "react";
import { ENTRY_LIST_ITEM_PROPS } from "./entry-list";

export type CONTEXT_MENU_DISPATCH_TYPE =
  | "refresh"
  | "open"
  | "bookmark"
  | "remove-bookmark"
  | "create-folder"
  | "create-text-file"
  | "delete"
  | "view-as-icons"
  | "view-as-list"
  | "view-as-details"
  | "select-all";

function ContextMenuButton({
  dispatch,
  type,
  children,
  hotkey,
}: {
  dispatch: (type: CONTEXT_MENU_DISPATCH_TYPE) => (_: any) => any;
  type: CONTEXT_MENU_DISPATCH_TYPE;
  children: ReactNode;
  hotkey?: string;
}) {
  return (
    <div className="context-menu-button-container">
      <a className="context-menu-button" onClick={dispatch(type)}>
        {children}
      </a>
      <div className="context-menu-hotkey">{hotkey}</div>
    </div>
  );
}

export function ContextMenu({
  dispatcher,
  selectionEntries,
}: {
  dispatcher: (type: CONTEXT_MENU_DISPATCH_TYPE) => any;
  selectionEntries: ENTRY_LIST_ITEM_PROPS[];
}) {
  const dispatch = (type: CONTEXT_MENU_DISPATCH_TYPE) => {
    return (_: any) => {
      dispatcher(type);
    };
  };

  const hasSelection = selectionEntries.length !== 0;
  const hasBookmarksOnly =
    selectionEntries.filter((entry) => {
      return entry.isBookmarked === true;
    }).length === selectionEntries.length;

  return (
    <div className="context-menu-closed" id="context-menu">
      {hasSelection && (
        <>
          <ContextMenuButton dispatch={dispatch} type="open" hotkey="Enter">
            Open as any
          </ContextMenuButton>

          <ContextMenuButton dispatch={dispatch} type="delete" hotkey="Delete">
            Delete
          </ContextMenuButton>
          {hasBookmarksOnly && (
            <ContextMenuButton dispatch={dispatch} type="remove-bookmark">
              Unpin from sidebar
            </ContextMenuButton>
          )}
          {!hasBookmarksOnly && (
            <ContextMenuButton dispatch={dispatch} type="bookmark">
              Pin to sidebar
            </ContextMenuButton>
          )}
        </>
      )}

      {!hasSelection && (
        <>
          <ContextMenuButton dispatch={dispatch} type="create-folder">
            Create folder
          </ContextMenuButton>
          <ContextMenuButton dispatch={dispatch} type="create-text-file">
            Create text file
          </ContextMenuButton>
          <ContextMenuButton
            dispatch={dispatch}
            type="select-all"
            hotkey="Ctrl + A"
          >
            Select all
          </ContextMenuButton>
          <ContextMenuButton
            dispatch={dispatch}
            type="refresh"
            hotkey="Ctrl + F5"
          >
            Refresh directory
          </ContextMenuButton>
        </>
      )}
      <ContextMenuButton
        dispatch={dispatch}
        type="view-as-list"
        hotkey="Ctrl + Shift + 1"
      >
        View as list
      </ContextMenuButton>
      <ContextMenuButton
        dispatch={dispatch}
        type="view-as-icons"
        hotkey="Ctrl + Shift + 2"
      >
        View as icons
      </ContextMenuButton>
      <ContextMenuButton
        dispatch={dispatch}
        type="view-as-details"
        hotkey="Ctrl + Shift + 3"
      >
        View as details
      </ContextMenuButton>
    </div>
  );
}
