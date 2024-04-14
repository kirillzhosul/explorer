import { useEffect, useState } from "react";
import { ITEM } from "../entities/item";
import { useKeyboardHandler } from "./keyboard/useKeyboardHandler";

export function useSelection() {
  const [selection, setSelection] = useState<ITEM[]>([]);
  const [selectionBase, setSelectionBase] = useState<ITEM | undefined>();
  const { heldButtons } = useKeyboardHandler(false);

  const containsPath = (path: string) => {
    // TODO: does it worth it?
    return selection.some((item: ITEM): boolean => {
      return item.path === path;
    });
  };

  const deselect = (item: ITEM) => {
    setSelection((s) => {
      return s.filter((i: ITEM) => {
        return item.path != i.path;
      });
    });
  };

  const clear = () => {
    setSelection([]);
    setSelectionBase(undefined);
  };

  const handleSelectFallthrough = (
    item: ITEM,
    multiselect: boolean
  ): boolean => {
    // TODO!: region select with shift
    const ctrl = heldButtons.includes("Control");

    if (containsPath(item.path)) {
      if (ctrl) {
        deselect(item);
        return false;
      } else if (selection.length > 1) {
        setSelection([item]);
        return false;
      }
      // Fallthrough: LMB on single item
      return true;
    }
    if (multiselect && ctrl) {
      if (!selectionBase) {
        setSelectionBase(item);
      }
      setSelection((p) => [...p, item]);
      return false;
    }

    if (multiselect) {
      setSelectionBase(item);
    }
    setSelection([item]);
    return false;
  };

  useEffect(() => {
    const mouseUpHandle = (event: MouseEvent) => {
      let className = (event.target as HTMLButtonElement | undefined)
        ?.className;
      if (className === "app-container") {
        setSelection([]);
      }
    };
    document.addEventListener("mouseup", mouseUpHandle);
    return () => {
      document.removeEventListener("mouseup", mouseUpHandle);
    };
  }, []);

  return {
    selection,
    setSelection,
    selectionBase,
    setSelectionBase,
    containsPath,
    handleSelectFallthrough,
    clear,
  };
}
