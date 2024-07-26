export function getReadableFileSizeString(byteSize: number, asSI: boolean) {
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

export function getFileSizeFromReadableSizeString(readableSize: string): number {
  let [baseN, baseMapping] = readableSize.split(" ")

  const mapping = {
    "kb": 1024,
    "mb": Math.pow(1024, 2),
    "gb": Math.pow(1024, 3),
    "tb": Math.pow(1024, 4),
    "pb": Math.pow(1024, 5),
    "eb": Math.pow(1024, 6),
    "zb": Math.pow(1024, 7),
    "yb": Math.pow(1024, 8),

    "kib": 1000,
    "mib": Math.pow(1000, 2),
    "gib": Math.pow(1000, 3),
    "tib": Math.pow(1000, 4),
    "pib": Math.pow(1000, 5),
    "eib": Math.pow(1000, 6),
    "zib": Math.pow(1000, 7),
    "yib": Math.pow(1000, 8),
  };

  baseMapping = baseMapping.toLowerCase()
  return Number(baseN) * mapping[baseMapping as keyof typeof mapping]
}