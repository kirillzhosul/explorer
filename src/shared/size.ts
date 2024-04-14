export function getReadableFileSizeString(byteSize: number) {
  let i = -1;
  let byteUnits = [" kB", " MB", " GB", " TB", "PB", "EB", "ZB", "YB"];
  do {
    byteSize /= 1024;
    i++;
  } while (byteSize > 1024);

  return Math.max(byteSize, 0.1).toFixed(1) + byteUnits[i];
}
