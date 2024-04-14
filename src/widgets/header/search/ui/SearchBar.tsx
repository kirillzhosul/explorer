import { useState } from "react";
import styles from "./SearchBar.module.css";
import { CloseIcon, ZoomIcon } from "./icons";

interface SEARCH_BAR_PROPS {
  searchTargetDisplayName: string;
  onInput: (query: string) => any;
}

export function SearchBar({
  searchTargetDisplayName,
  onInput,
}: SEARCH_BAR_PROPS) {
  let [query, setQuery] = useState<string>("");

  // TODO: Snap zoom icon correctly
  return (
    <div className={styles.searchBar}>
      <input
        className={styles.searchBarInput}
        type="text"
        placeholder={`Search ${searchTargetDisplayName}`}
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
