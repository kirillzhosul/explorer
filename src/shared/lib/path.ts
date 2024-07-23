/*
  Path library for working with path/file names etc
*/

// Defines possible ways to handle paths for different os
export enum OsPathStyle {
  windows,
  posix
}

// Defines possible separators for different os
export enum OsPathSeparator {
  windows = "\\",
  windows_drive = ":\\",
  windows_drive_mark = ":",
  posix = "/"
}

// Default fallback,
// TODO: Allow to be modified or detected
const OS_DEFAULT_PATH_STYLE_FALLBACK = OsPathStyle.posix;


export function splitPath(path: string, os_path_style: OsPathStyle = OS_DEFAULT_PATH_STYLE_FALLBACK): string[] {
  /*
    Split given raw path into array of path items
  */
  if (os_path_style == OsPathStyle.posix) {
    path = path.slice(1);
    if (path == "") return ["/"]
    return path.split(OsPathSeparator.posix)
  }

  if (path.endsWith(OsPathSeparator.windows_drive)) {
    // If path is only Windows-like drive path
    // we should handle that case so we not have blank empty item
    path = path.slice(0, path.length - OsPathSeparator.windows_drive.length);
  }
  return path.replace(
    OsPathSeparator.windows_drive,
    OsPathSeparator.windows
  ).split(OsPathSeparator.windows);

}


export function getPathTarget(path: string, os_path_style: OsPathStyle = OS_DEFAULT_PATH_STYLE_FALLBACK): string {
  /*
    Return target filename or directory from path
    Examples:
      a/b/c -> c
      a/b/c/ -> c
      a/b/c.txt -> c.txt
  */
  if (os_path_style == OsPathStyle.posix) {
    if (path == OsPathSeparator.posix) return path
    path = path.replace(RegExp(`${OsPathSeparator.posix}+$`), "") // Replaces all trailing slashes
  }

  const segments = splitPath(path, os_path_style)
  const target = segments.pop()
  if (target === undefined || target === "") {
    throw Error(`Tried to get target for path '${path}' but last segment is none`)
  }
  return target;
}


export function getFileExtension(path: string, os_path_style: OsPathStyle = OS_DEFAULT_PATH_STYLE_FALLBACK): string {
  /*
    Return extension of the file
  */
  for (let i = path.length - 1; i > -1; --i) {
    const value = path[i];

    if (value === ".") {
      if (i <= 1) return "";
      if (isPathSeparator(path[i - 1], os_path_style)) {
        return "";
      }
      return path.substring(i + 1);
    }

    if (isPathSeparator(value, os_path_style)) {
      return "";
    }
  }

  return ""
}

const isPathSeparator = (value: string, os_path_style: OsPathStyle = OS_DEFAULT_PATH_STYLE_FALLBACK): boolean => {
  /*
    Return is given value is separator for given os path style
    (Posix does not contain any special disk path specification, as Windows does)
  */
  if (os_path_style == OsPathStyle.posix) {
    return value == OsPathSeparator.posix
  }
  return value === OsPathSeparator.windows || value === OsPathSeparator.windows_drive_mark
};
