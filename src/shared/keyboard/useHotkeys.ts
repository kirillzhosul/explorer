import { useEffect, useState } from "react";
import { useKeyboardHandler } from "./useKeyboardHandler";
import { HOTKEY } from "./types";

export function useHotkeys(preventDefault: boolean = false) {
  const { heldButtons } = useKeyboardHandler(preventDefault);
  const [hotkey, setHotkey] = useState<HOTKEY | undefined>(undefined);

  const getCurrentHotkey = (): HOTKEY | undefined => {
    if (heldButtons.includes("Enter") && heldButtons.length == 1) {
      return HOTKEY.enter;
    }
    if (heldButtons.includes("Delete") && heldButtons.length == 1) {
      return HOTKEY.delete;
    }

    if (!heldButtons.includes("Control")) {
      return;
    }

    if (heldButtons.includes("F5") && heldButtons.length == 2) {
      return HOTKEY.refresh;
    }

    if (heldButtons.includes("a") && heldButtons.length == 2) {
      return HOTKEY.selectAll;
    }

    if (!heldButtons.includes("Shift")) {
      return;
    }

    if (heldButtons.includes("!") && heldButtons.length == 3) {
      return HOTKEY.viewAsList;
    }
    if (heldButtons.includes("@") && heldButtons.length == 3) {
      return HOTKEY.viewAsIcons;
    }
  };
  useEffect(() => {
    setHotkey(getCurrentHotkey());
  }, [heldButtons]);

  return {
    hotkey,
  };
}
