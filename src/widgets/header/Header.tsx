import { SearchBar } from "./search";

import { PathBar } from "./pathbar";
import { Navigation } from "./navigation";
import { NAVIGATION_ACTION_TYPE } from ".";
import styles from "./Header.module.css";
import { displayBaseNameFromPath } from "../../shared/lib/path";

type NAVIGATION_HEADER_PROPS = {
  fullPath: string;
  disabledActions: NAVIGATION_ACTION_TYPE[];
  onNavigate: (action: NAVIGATION_ACTION_TYPE) => any;
  onSearchInput: (query: string) => any;
  onChangePath: (newPath: string) => any;
};

export function Header({
  fullPath,
  disabledActions,
  onNavigate,
  onChangePath,
  onSearchInput,
}: NAVIGATION_HEADER_PROPS) {
  // TODO: fill header with bars
  // TODO: Add sub-header with additional navigation
  // TODO: Change color based on window hover

  return (
    <div className={styles.container}>
      <Navigation disabledActions={disabledActions} onNavigate={onNavigate} />
      <PathBar fullPath={fullPath} onChangePath={onChangePath} />
      <SearchBar
        searchTargetDisplayName={displayBaseNameFromPath(fullPath)}
        onInput={onSearchInput}
      />
    </div>
  );
}
