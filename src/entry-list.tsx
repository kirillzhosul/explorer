import { MouseEvent } from "react";
import { ENTRY_TYPE } from "./types";
import { Entry } from "./entry";
import { WINDOWS_ATTRIBUTES } from "./attributes";
import { SettingsDTO } from "./settings-storage";

export type ENTRY_LIST_DISK_METADATA = {
  filesystem: string;
  sizeTotal: string;
  sizeLeft: string;
};
export type ENTRY_LIST_ITEM_METADATA = {
  disk?: ENTRY_LIST_DISK_METADATA;
  readonly?: boolean;
  attributes: {
    windows: WINDOWS_ATTRIBUTES;
    linux?: undefined;
  };
  fileSize: number;
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

export type ENTRY_LIST_VIEW_AS = "list" | "icons" | "details";
export type ENTRY_LIST_PROPS = {
  entries: ENTRY_LIST_ITEM_PROPS[];
  viewAs: ENTRY_LIST_VIEW_AS;
  settings: SettingsDTO;
  onClick: (e: MouseEvent, entry: ENTRY_LIST_ITEM_PROPS) => any;
};

export function EntryList({
  entries,
  onClick,
  viewAs,
  settings,
}: ENTRY_LIST_PROPS) {
  /**
   * Renderer of a list filled with entities
   */
  return (
    <ul className={`entry-list entry-list-view-as-${viewAs}`}>
      {entries.map((entry: ENTRY_LIST_ITEM_PROPS) => (
        <li key={entry.fullPath} className="entry-list-item">
          <Entry
            settings={settings}
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
