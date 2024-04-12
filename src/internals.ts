export const INTERNALS_MARK = "explorer::\\";
export const INTERNALS_HOME = `${INTERNALS_MARK}home`;
export const INTERNALS_SETTINGS = `${INTERNALS_MARK}settings`;

export const displayInternalPath = (path: string): string => {
  if (path === INTERNALS_HOME) {
    return "This PC";
  }
  if (path === INTERNALS_SETTINGS) {
    return "Settings";
  }
  return path;
};
