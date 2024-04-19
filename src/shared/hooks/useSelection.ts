import { useEffect, useState } from "react";
import { ITEM } from "@@entities/item";
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

  const itemIndex = (items: ITEM[], item: ITEM): number | undefined => {
    let index = undefined;
    items.forEach((element: ITEM, i: number) => {
      if (element.path == item.path) {
        index = i;
        return;
      }
    });
    return index;
  };

  const handleSelectFallthrough = (
    items: ITEM[],
    item: ITEM,
    multiselect: boolean,
    rmb: boolean
  ): boolean => {
    // TODO!: region select with shift

    const ctrl = heldButtons.includes("Control");
    const shift = heldButtons.includes("Shift");

    const selectSingleItem_ = (item: ITEM) => {
      if (multiselect) {
        setSelectionBase(item);
      }
      setSelection([item]);
    };
    const pushSingleItem_ = (item: ITEM) => {
      if (multiselect && !selectionBase) {
        setSelectionBase(item);
      }
      setSelection((p) => [...p, item]);
    };
    const getRegionToSelect_ = (item: ITEM): [number, number] => {
      let baseIndex = itemIndex(items, selectionBase ?? selection[0]) ?? 0;
      let targetIndex = itemIndex(items, item) ?? 0;

      if (targetIndex > baseIndex) {
        return [baseIndex, targetIndex];
      }
      return [targetIndex, baseIndex];
    };
    const selectRegion = (items: ITEM[], a: number, b: number) => {
      setSelection(
        items.filter((_, i) => {
          return i >= a && i <= b;
        })
      );
    };

    if (rmb) {
      if (ctrl) {
        // We have to do nothing when control is pressed
        return false; // TODO: Context menu glitches
      }

      if (!containsPath(item.path)) {
        // If we pressing item with RMB that will cause selection trigger and then showing an context menu
        // If we already have an selection with that element - just do nothing
        selectSingleItem_(item);
      }
      return false;
    }

    if (shift) {
      selectRegion(items, ...getRegionToSelect_(item));
      return false;
    }

    if (containsPath(item.path)) {
      // We clicked on an already selected item

      if (ctrl) {
        // Ctrl + LMB will deselect item (multiselect)
        deselect(item);
        return false;
      } else if (selection.length > 1) {
        // If we LMB on an item when we have any other selection,
        // we need to clear selection before going to open
        selectSingleItem_(item);
        return false;
      }
      // Fallthrough: LMB on single item, open it
      return true;
    }

    if (multiselect && ctrl) {
      // We are selecting multiple items with ctrl + lmb
      pushSingleItem_(item);
      return false;
    }

    selectSingleItem_(item);
    return false;
  };

  const handleSelectWithCallback = (
    items: ITEM[],
    item: ITEM,
    multiselect: boolean,
    onFallthrough: (item: ITEM) => any,
    rmb: boolean
  ) => {
    if (handleSelectFallthrough(items, item, multiselect, rmb) && !rmb) {
      onFallthrough(item);
    }
  };

  useEffect(() => {
    const mouseUpHandle = (event: MouseEvent) => {
      let className = (event.target as HTMLElement | undefined)?.className;
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
    items: selection,
    setSelection,
    selectionBase,
    setSelectionBase,
    containsPath,
    handleSelectWithCallback,
    clear,
  };
}
