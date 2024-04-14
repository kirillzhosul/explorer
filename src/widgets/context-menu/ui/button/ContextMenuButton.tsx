// sourcery skip: binary-operator-identity
import { ReactNode } from "react";
import { CONTEXT_MENU_ACTION_TYPE } from "../../types";
import styles from "./ContextMenuButton.module.css";

type CONTEXT_MENU_BUTTON_PROPS = {
  dispatch: (type: CONTEXT_MENU_ACTION_TYPE) => any;
  type: CONTEXT_MENU_ACTION_TYPE;
  children: ReactNode;
  hotkey?: string;
  icon?: ReactNode;
};

export function ContextMenuButton({
  dispatch,
  type,
  children,
  hotkey,
  icon,
}: CONTEXT_MENU_BUTTON_PROPS) {
  return (
    <div className={styles.container} onClick={() => dispatch(type)}>
      <div className={styles.icon}>{icon && <>{icon}</>}</div>

      <div className={styles.button}>{children}</div>
      {hotkey && <div className={styles.hotkey}>{hotkey}</div>}
    </div>
  );
}
