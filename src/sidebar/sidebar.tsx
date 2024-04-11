/*
      {path !== "" && (
        <div>
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              if (path.split("\\").length - 1 == 1) {
                let newPath = path.substring(0, path.lastIndexOf("\\")) + "\\";
                if (newPath != path) {
                  setPath(newPath);
                  console.log("root");
                } else {
                  setPath("");
                  setEntries([]);
                }
              } else {
                setPath((path) => {
                  return path.substring(0, path.lastIndexOf("\\"));
                });
              }
            }}
          >
            {" "}
            {"< - "}Go above
          </a>
        </div>
      )}


      {path !== "" && (
        <div>
          <a
            href=""
            onClick={async (e) => {
              e.preventDefault();
              setEntries(await requestEntries(path));
            }}
          >
            Reload
          </a>
        </div>
      )}

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
import { ENTRY_LIST_ITEM_PROPS } from "../entry/entry-list";
import { Entry } from "../entry/entry";

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
