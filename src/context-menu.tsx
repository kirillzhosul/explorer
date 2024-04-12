import { ReactNode } from "react";

export type CONTEXT_MENU_DISPATCH_TYPE =
  | "refresh"
  | "open-terminal-here"
  | "open"
  | "bookmark"
  | "create-folder"
  | "create-text-file"
  | "delete";

function ContextMenuButton({
  dispatch,
  type,
  children,
}: {
  dispatch: (type: CONTEXT_MENU_DISPATCH_TYPE) => (_: any) => any;
  type: CONTEXT_MENU_DISPATCH_TYPE;
  children: ReactNode;
}) {
  return (
    <div>
      <a className="context-menu-button" onClick={dispatch(type)}>
        {children}
      </a>
    </div>
  );
}
export function ContextMenu({
  dispatcher,
  selectionExists,
}: {
  dispatcher: (type: CONTEXT_MENU_DISPATCH_TYPE) => any;
  selectionExists: boolean;
}) {
  const dispatch = (type: CONTEXT_MENU_DISPATCH_TYPE) => {
    return (_: any) => {
      dispatcher(type);
    };
  };

  return (
    <div className="context-menu-closed" id="context-menu">
      {selectionExists && (
        <>
          <ContextMenuButton dispatch={dispatch} type="open">
            Open as any
          </ContextMenuButton>
          <ContextMenuButton dispatch={dispatch} type="bookmark">
            Bookmark
          </ContextMenuButton>
          <ContextMenuButton dispatch={dispatch} type="delete">
            Delete
          </ContextMenuButton>
        </>
      )}

      {!selectionExists && (
        <>
          <ContextMenuButton dispatch={dispatch} type="refresh">
            Refresh directory
          </ContextMenuButton>
          <ContextMenuButton dispatch={dispatch} type="open-terminal-here">
            Open terminal here
          </ContextMenuButton>
          <ContextMenuButton dispatch={dispatch} type="create-folder">
            Create folder
          </ContextMenuButton>
          <ContextMenuButton dispatch={dispatch} type="create-text-file">
            Create text file
          </ContextMenuButton>
        </>
      )}
    </div>
  );
}
