/// <reference types="vite-plugin-svgr/client" />
import PathDividerIcon from "@svg/pathDivider.svg?react";

import { useState } from "react";
import { splitFullPath, splitFullPathForDisplay } from "..";
import styles from "./Pathbar.module.css";

import clsx from "clsx";

interface PATH_BAR_PROPS {
  fullPath: string;
  onChangePath: (newPath: string) => any;
}

export function PathBar({ fullPath, onChangePath }: PATH_BAR_PROPS) {
  // TODO: Better wrapping with shifting for long path
  // TODO: Better styling for path segment hovering
  // TODO: Allow to select divider for dropdown
  // TODO: Show path completions
  // TODO: Validation for the path input
  // TODO: Keybinds && enter state for the path bar
  // TODO: Fix bug when go to root of the drive
  // TODO: Add icon to the sidebar
  const [focusForPath, setFocusForPath] = useState<boolean>(false);
  const displayPath = splitFullPathForDisplay(fullPath);

  return (
    <div
      className={clsx(
        styles.pathBar,
        focusForPath ? styles.pathBarFocused : ""
      )}
      onClick={(e) => {
        const target = e.target as HTMLElement;
        if (target.id !== "path-bar-segment") {
          setFocusForPath((prev) => !prev);
          e.preventDefault();
          e.stopPropagation();
        }
      }}
    >
      {focusForPath && (
        <input
          autoFocus
          value={fullPath}
          className={styles.pathFocus}
          onChange={(e) => {
            onChangePath(e.currentTarget.value);
          }}
          onBlur={() => {
            setFocusForPath(false);
          }}
        />
      )}

      {!focusForPath && (
        <>
          <div className={styles.pathBarDividerIcon}>
            <PathDividerIcon />
          </div>
          {displayPath.map((pathSegment, pathIndex) => {
            return (
              <div className={styles.pathBarCompositeSegment} key={pathSegment}>
                <div
                  className={styles.pathBarSegment}
                  onClick={() => {
                    let newPath = splitFullPath(fullPath).slice(
                      0,
                      pathIndex + 1
                    );
                    onChangePath(newPath.join("\\"));
                  }}
                >
                  <span id="path-bar-segment">{pathSegment}</span>
                </div>
                <div className={styles.pathBarDividerIcon}>
                  <PathDividerIcon />
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
