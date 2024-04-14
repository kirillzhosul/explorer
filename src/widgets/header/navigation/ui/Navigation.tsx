import { NAVIGATION_ACTION_TYPE } from "..";
import { NavigationButton } from "./button";
import { ForwardIcon, RefreshIcon, UpIcon, BackIcon } from "./button/icons";
import styles from "./Navigation.module.css";

interface NAVIGATION_PROPS {
  disabledActions: NAVIGATION_ACTION_TYPE[];
  onNavigate: (action: NAVIGATION_ACTION_TYPE) => any;
}

export function Navigation({ disabledActions, onNavigate }: NAVIGATION_PROPS) {
  return (
    <div className={styles.container}>
      <NavigationButton
        onClick={onNavigate}
        isDisabled={disabledActions.includes(NAVIGATION_ACTION_TYPE.back)}
        action={NAVIGATION_ACTION_TYPE.back}
      >
        <BackIcon />
      </NavigationButton>

      <NavigationButton
        onClick={onNavigate}
        isDisabled={disabledActions.includes(NAVIGATION_ACTION_TYPE.forward)}
        action={NAVIGATION_ACTION_TYPE.forward}
      >
        <ForwardIcon />
      </NavigationButton>

      <NavigationButton
        onClick={onNavigate}
        isDisabled={disabledActions.includes(NAVIGATION_ACTION_TYPE.up)}
        action={NAVIGATION_ACTION_TYPE.up}
      >
        <UpIcon />
      </NavigationButton>

      <NavigationButton
        onClick={onNavigate}
        isDisabled={disabledActions.includes(NAVIGATION_ACTION_TYPE.refresh)}
        action={NAVIGATION_ACTION_TYPE.refresh}
      >
        <RefreshIcon />
      </NavigationButton>
    </div>
  );
}
