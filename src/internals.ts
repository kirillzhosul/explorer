export const INTERNALS_MARK = "explorer::\\";
export const INTERNALS_HOME = `${INTERNALS_MARK}home`;

export const displayInternalPath = (path: string): string => {
  if (path === INTERNALS_HOME) {
    return "This PC";
  }

  return path;
};
