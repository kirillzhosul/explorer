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

function isMouseMovedAgainstContextMenu(e: MouseEvent): boolean {
  /**
   * @kirillzhosul: Implemented due to MacOS bug with context menu which is closing after releasing touch.
   *
   * Assume mouse moved against context menu if context menu position is not equal to the current mouse position.
   */
  const contextMenu = document.getElementById("context-menu");
  if (!contextMenu) {
    return false;
  }
  const assumedY = mouseY(e) + "px";
  const assumedX = mouseX(e) + "px";
  return (
    contextMenu.style.top !== assumedY || contextMenu.style.left !== assumedX
  );
}
export const useContextMenu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { heldButtons } = useKeyboardHandler(false);

  useEffect(() => {
    const contextMenuHandler = function (e: MouseEvent) {
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
      if (!isMouseMovedAgainstContextMenu(e)) return;
      // TODO replace with module css
      if (
        target?.className !== "context-menu-button" &&
        target?.id !== "context-menu" &&
        target?.id !== "context-menu-button-container"
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
