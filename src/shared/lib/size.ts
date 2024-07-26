export function getReadableFileSizeString(byteSize: number, asSI: boolean = false) {
  let i = -1;
  let unit = 1024
  let mapping = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  if (asSI) {
    unit = 1000;
    mapping = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  }

  do {
    byteSize /= unit;
    i++;
  } while (byteSize > unit);

  let size = Math.max(byteSize, 0.1).toFixed(1)
  return `${size} ${mapping[i]}`;
}
