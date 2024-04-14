import { useEffect, useState } from "react";

export const useKeyboardHandler = (preventDefault: boolean = true) => {
  const [heldButtons, setHeldButtons] = useState<string[]>([]);

  useEffect(() => {
    const keyDownHandler = (event: any) => {
      if (preventDefault) {
        event.preventDefault();
      }
      if (heldButtons.includes(event.key)) {
        return;
      }
      setHeldButtons((prev) => {
        return [...new Set([...prev, event.key])];
      });
    };

    const keyUpHandler = (event: any) => {
      event.preventDefault();
      setHeldButtons((prev) => {
        return prev.filter((key) => {
          return key != event.key;
        }, prev);
      });
    };

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keydown", keyUpHandler);
    };
  }, []);

  return {
    heldButtons,
  };
};
