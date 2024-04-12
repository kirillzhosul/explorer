import { MouseEventHandler } from "react";
import { EntryIcon, Extensions } from "./entry-icon";
import { ENTRY_TYPE } from "./types";
import { ENTRY_LIST_ITEM_METADATA } from "./entry-list";
import { SettingsDTO } from "./settings-storage";

type EntryProps = {
  displayName: string;
  type: ENTRY_TYPE;
  onClick: MouseEventHandler;
  isSelected: boolean;
  isBaseSelection: boolean;
  metadata?: ENTRY_LIST_ITEM_METADATA;
  isBookmarked?: boolean;
  settings: SettingsDTO;
};

const isSeparator = (value: string): boolean =>
  value === "/" || value === "\\" || value === ":";
function extensionFromPath(path: string): string | undefined {
  for (let i = path.length - 1; i > -1; --i) {
    const value = path[i];
    if (value === ".") {
      if (i > 1) {
        if (isSeparator(path[i - 1])) {
          return "";
        }
        return path.substring(i + 1);
      }
      return "";
    }
    if (isSeparator(value)) {
      return "";
    }
  }
}

export function Entry({
  displayName,
  type,
  onClick,
  isSelected,
  isBaseSelection,
  metadata,
  isBookmarked,
  settings,
}: EntryProps) {
  /**
   * Base entry for any item
   * Provides rendering and sort of selection of the entity based on the type
   */
  let className =
    "entry " +
    (isSelected
      ? "entry-selected"
      : isBaseSelection
      ? "entry-base-selection"
      : "entry-unselected");

  return (
    <div className={className} onClick={onClick}>
      {settings.displayIcons && (
        <EntryIcon
          type={type}
          extension={extensionFromPath(displayName) as Extensions}
        />
      )}

      <span className="entry-text">{displayName}</span>
      {isBookmarked && (
        <svg
          width="12px"
          height="12px"
          viewBox="0 0 32 32"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            margin: "5px",
          }}
        >
          <g strokeWidth="1" fillRule="evenodd">
            <g
              transform="translate(-152.000000, -879.000000)"
              fill="currentColor"
            >
              <path d="M168,903.21 L160.571,907.375 L161.989,898.971 L155.594,892.442 L164.245,891.317 L168,883.313 L171.722,891.317 L180.344,892.54 L174.011,899.002 L175.335,907.406 L168,903.21 L168,903.21 Z M184,891.244 L172.962,889.56 L168,879 L163.038,889.56 L152,891.244 L159.985,899.42 L158.095,911 L168,905.53 L177.905,911 L176.015,899.42 L184,891.244 L184,891.244 Z"></path>
            </g>
          </g>
        </svg>
      )}
      {metadata?.disk && (
        <span className="entry-metadata-disk">
          {metadata.disk.sizeLeft} / {metadata.disk.sizeTotal}
        </span>
      )}
    </div>
  );
}
