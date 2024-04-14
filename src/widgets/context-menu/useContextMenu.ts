import { useEffect, useState } from "react";
import { mouseX, mouseY } from "@@shared/lib/mouse";
import { useKeyboardHandler } from "@@shared/hooks/keyboard/useKeyboardHandler";

function toggleContextMenuVisible(isVisible: boolean) {
  const contextMenu = document.getElementById("context-menu");
  if (!contextMenu) {
    return;
  }
  if (isVisible) {
    contextMenu.className = "context-menu-opened";
  } else {
    contextMenu.className = "context-menu-closed";
  }
}

function moveContextMenu(e: MouseEvent) {
  const contextMenu = document.getElementById("context-menu");
  if (!contextMenu) {
    return;
  }
  contextMenu.style.top = mouseY(e) + "px";
  contextMenu.style.left = mouseX(e) + "px";
}

export const useContextMenu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { heldButtons } = useKeyboardHandler(false);

  useEffect(() => {
    const contextMenuHandler = function (e: any) {
      setIsOpen(true);
      moveContextMenu(e);
      e.preventDefault();
    };

    document.addEventListener("contextmenu", contextMenuHandler);
    return () =>
      document.removeEventListener("contextmenu", contextMenuHandler);
  }, []);

  useEffect(() => {
    const mouseUpHandle = (e: MouseEvent) => {
      let target = e.target as HTMLElement | undefined;
      // TODO replace with module css
      if (
        target?.className !== "context-menu-button" &&
        target?.id !== "context-menu"
      ) {
        e.stopPropagation();
        setIsOpen(false);
      }
    };

    document.addEventListener("mouseup", mouseUpHandle);
    return () => {
      document.removeEventListener("mouseup", mouseUpHandle);
    };
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [heldButtons]);

  useEffect(() => toggleContextMenuVisible(isOpen), [isOpen]);

  return { isOpen, close: () => setIsOpen(false) };
};
