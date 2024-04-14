const isSeparator = (value: string): boolean => {
  return value === "/" || value === "\\" || value === ":";
};

export function splitFullPathForDisplay(fullPath: string): string[] {
  // TODO: Only works for windows
  // TODO: Display disk name rather than raw disk path
  if (fullPath.endsWith(":\\")) {
    fullPath = fullPath.slice(0, fullPath.length - 2);
  }
  fullPath = fullPath.replace(":\\", "\\");
  return fullPath.split("\\");
}

export function splitFullPath(fullPath: string): string[] {
  // TODO: Only works for windows
  return fullPath.split("\\");
}

export function displayBaseNameFromPath(path: string) {
  return path.split("\\").pop() ?? path;
}

export function extensionFromPath(path: string): string | undefined {
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

export function toFileName(path: string): string {
  return path.replace(/^.*[\\/]/, "");
}
