/*
     {path !== "" && (
        <div>
          <input
            type="checkbox"
            checked={filters.hideDotFiles}
            onChange={(e) => {
              e.stopPropagation();

              setFilters((oldFilters) => {
                let newFilters = { ...oldFilters };
                newFilters.hideDotFiles = !newFilters.hideDotFiles;
                return newFilters;
              });
            }}
          />{" "}
          Hide dotted
        </div>
      )}
*/

import { MouseEvent } from "react";
import { ENTRY_LIST_ITEM_PROPS } from "./entry-list";
import { Entry } from "./entry";

export const Sidebar = ({
  entries,
  onClick,
}: {
  entries: ENTRY_LIST_ITEM_PROPS[];
  onClick: (e: MouseEvent, entry: ENTRY_LIST_ITEM_PROPS) => any;
}) => {
  return (
    <div className="sidebar">
      <ul className="sidebar-list">
        {entries.map((entry) => {
          return (
            <li className="sidebar-list-item" key={entry.fullPath}>
              <Entry
                isBaseSelection={entry.isBaseSelection}
                isSelected={entry.isSelected}
                displayName={entry.displayName}
                type={entry.displayType}
                onClick={(e): any => {
                  onClick(e, entry);
                }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};
