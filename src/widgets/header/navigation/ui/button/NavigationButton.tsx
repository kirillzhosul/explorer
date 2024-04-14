import { NAVIGATION_ACTION_TYPE } from "../..";
import styles from "./NavigationButton.module.css";

interface NAVIGATION_BUTTONS_PROPS {
  isDisabled: boolean;
  action: NAVIGATION_ACTION_TYPE;

  onClick: (action: NAVIGATION_ACTION_TYPE) => any;

  children: any;
}
export function NavigationButton({
  isDisabled,
  action,
  onClick,
  children,
}: NAVIGATION_BUTTONS_PROPS) {
  // TODO: Fix selection background padding
  return (
    <div
      className={isDisabled ? styles.buttonDisabled : styles.buttonEnabled}
      onClick={(e) => {
        e.preventDefault();
        onClick(action);
      }}
    >
      {children}
    </div>
  );
}
