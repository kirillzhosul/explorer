import { MouseEvent } from "react";
import { ENTRY_TYPE } from "./types";
import { Entry } from "./entry";

export type ENTRY_LIST_DISK_METADATA = {
  filesystem: string;
  sizeTotal: string;
  sizeLeft: string;
};
export type ENTRY_LIST_ITEM_METADATA = {
  disk?: ENTRY_LIST_DISK_METADATA;
};

export type ENTRY_LIST_ITEM_PROPS = {
  isSelected: boolean;
  isBookmarked?: boolean;
  isBaseSelection: boolean;
  displayType: ENTRY_TYPE;
  displayName: string;
  fullPath: string;
  metadata?: ENTRY_LIST_ITEM_METADATA;
};

export type ENTRY_LIST_PROPS = {
  entries: ENTRY_LIST_ITEM_PROPS[];
  onClick: (e: MouseEvent, entry: ENTRY_LIST_ITEM_PROPS) => any;
};

export function EntryList({ entries, onClick }: ENTRY_LIST_PROPS) {
  /**
   * Renderer of a list filled with entities
   */
  return (
    <ul className="entry-list">
      {entries.map((entry: ENTRY_LIST_ITEM_PROPS) => (
        <li key={entry.fullPath} className="entry-list-item">
          <Entry
            isBookmarked={entry.isBookmarked}
            isSelected={entry.isSelected}
            displayName={entry.displayName}
            isBaseSelection={entry.isBaseSelection}
            type={entry.displayType}
            metadata={entry.metadata}
            onClick={(e) => {
              onClick(e, entry);
            }}
          />
        </li>
      ))}
    </ul>
  );
}
