import { useEffect, useState } from "react";

function mouseX(evt: any) {
  if (evt.pageX) {
    return evt.pageX;
  } else if (evt.clientX) {
    return (
      evt.clientX +
      (document.documentElement.scrollLeft || document.body.scrollLeft)
    );
  } else {
    return null;
  }
}

function mouseY(evt: any) {
  if (evt.pageY) {
    return evt.pageY;
  } else if (evt.clientY) {
    return (
      evt.clientY +
      (document.documentElement.scrollTop || document.body.scrollTop)
    );
  } else {
    return null;
  }
}

export const useContextMenu = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const close = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const contextMenuHandler = function (e: any) {
      setIsOpen(true);

      const contextMenu = document.getElementById("context-menu");
      if (contextMenu) {
        contextMenu.style.top = mouseY(e) + "px";
        contextMenu.style.left = mouseX(e) + "px";
      }

      e.preventDefault();
    };

    document.addEventListener("contextmenu", contextMenuHandler);

    return () => {
      document.removeEventListener("contextmenu", contextMenuHandler);
    };
  }, []);

  useEffect(() => {
    const contextMenu = document.getElementById("context-menu");
    if (contextMenu) {
      if (isOpen) {
        contextMenu.className = "context-menu-opened";
      } else {
        contextMenu.className = "context-menu-closed";
      }
    }
  }, [isOpen]);

  return { isOpen, close };
};
