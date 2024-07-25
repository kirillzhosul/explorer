import { displayInternalPath, INTERNALS_MARK } from "@@shared/lib/internals";
import { getPathTarget } from "@@shared/lib/path";
import { useState } from "react";
import styles from "./SearchBar.module.css";
import { CloseIcon, ZoomIcon } from "./icons";

interface SEARCH_BAR_PROPS {
  searchPath: string;
  onInput: (query: string) => any;
}

export function SearchBar({
  searchPath,
  onInput,
}: SEARCH_BAR_PROPS) {
  let [query, setQuery] = useState<string>("");

  // TODO: Snap zoom icon correctly
  const isDisabled = searchPath.startsWith(INTERNALS_MARK)
  const searchTarget = isDisabled ? displayInternalPath(searchPath) : getPathTarget(searchPath)
  return (
    <div className={styles.searchBar}>
      <input
        className={isDisabled ? styles.searchBarInputDisabled : styles.searchBarInput}
        type="text"
        disabled={isDisabled}
        placeholder={`Search ${searchTarget}`}
        value={query}
        onInput={(e) => {
          const newQuery = e.currentTarget.value;
          setQuery(newQuery);
          onInput(newQuery);
        }}
      ></input>
      {query !== "" && (
        <div
          onClick={() => {
            setQuery("");
            onInput("");
          }}
        >
          <CloseIcon />
        </div>
      )}

      <ZoomIcon />
    </div>
  );
}
