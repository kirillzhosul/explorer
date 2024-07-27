import { ITEM } from "@@entities/item";
import { INTERNALS_MARK } from "@@shared/lib/internals";
import { CONTEXT_MENU_ACTION_TYPE } from "../types";
import { ContextMenuButton } from "./button";

type CONTEXT_MENU_PROPS = {
  dispatcher: (type: CONTEXT_MENU_ACTION_TYPE) => any;
  selection: ITEM[];
  path: string,
};

export function ViewAsButtons({
  dispatcher,
}: {
  dispatcher: (type: CONTEXT_MENU_ACTION_TYPE) => any;
}) {
  return (
    <>
      <ContextMenuButton
        dispatch={dispatcher}
        type={CONTEXT_MENU_ACTION_TYPE.viewAsList}
        hotkey="Ctrl + Shift + 1"
      >
        View as list
      </ContextMenuButton>
      <ContextMenuButton
        dispatch={dispatcher}
        type={CONTEXT_MENU_ACTION_TYPE.viewAsIcons}
        hotkey="Ctrl + Shift + 2"
      >
        View as icons
      </ContextMenuButton>
    </>
  );
}

export function NoSelectionButtons({
  dispatcher,
}: {
  dispatcher: (type: CONTEXT_MENU_ACTION_TYPE) => any;
}) {
  return (
    <>
      <ContextMenuButton
        dispatch={dispatcher}
        type={CONTEXT_MENU_ACTION_TYPE.createDirectory}
      >
        Create folder
      </ContextMenuButton>
      <ContextMenuButton
        dispatch={dispatcher}
        type={CONTEXT_MENU_ACTION_TYPE.createTextFile}
      >
        Create text file
      </ContextMenuButton>
      <ContextMenuButton
        dispatch={dispatcher}
        type={CONTEXT_MENU_ACTION_TYPE.selectAll}
        hotkey="Ctrl + A"
      >
        Select all
      </ContextMenuButton>
      <ContextMenuButton
        dispatch={dispatcher}
        type={CONTEXT_MENU_ACTION_TYPE.refresh}
        hotkey="Ctrl + F5"
      >
        Refresh directory
      </ContextMenuButton>
    </>
  );
}

export function SelectionButtons({
  dispatcher,
  hasPinsOnly,
}: {
  dispatcher: (type: CONTEXT_MENU_ACTION_TYPE) => any;
  hasPinsOnly: boolean;
}) {
  return (
    <>
      <ContextMenuButton
        dispatch={dispatcher}
        type={CONTEXT_MENU_ACTION_TYPE.open}
        hotkey="Enter"
      >
        Open as any
      </ContextMenuButton>

      <ContextMenuButton
        dispatch={dispatcher}
        type={CONTEXT_MENU_ACTION_TYPE.delete}
        hotkey="Delete"
      >
        Delete
      </ContextMenuButton>
      {hasPinsOnly && (
        <ContextMenuButton
          dispatch={dispatcher}
          type={CONTEXT_MENU_ACTION_TYPE.unpin}
        >
          Unpin from sidebar
        </ContextMenuButton>
      )}
      {!hasPinsOnly && (
        <ContextMenuButton
          dispatch={dispatcher}
          type={CONTEXT_MENU_ACTION_TYPE.pin}
        >
          Pin to sidebar
        </ContextMenuButton>
      )}
    </>
  );
}

export function ContextMenu({ dispatcher, selection, path }: CONTEXT_MENU_PROPS) {
  // TODO: fix gap for hotkey
  // TODO: add icons
  // TODO: add dropdown feature
  // TODO: refactor hotkey storage
  const hasSelection = selection.length !== 0;
  const hasPinsOnly = selection.filter((e) => !e.flags.pin).length === 0;

  if (path.startsWith(INTERNALS_MARK)) {
    return <></>
  }
  return (
    <div className="context-menu-closed" id="context-menu">
      {hasSelection && (
        <SelectionButtons dispatcher={dispatcher} hasPinsOnly={hasPinsOnly} />
      )}
      {!hasSelection && <NoSelectionButtons dispatcher={dispatcher} />}
      <ViewAsButtons dispatcher={dispatcher} />
    </div>
  );
}
