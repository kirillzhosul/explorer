export function getReadableFileSizeString(byteSize: number, asSI:boolean=false) {
  let i = -1;
  let unit = asSI ? 1000 : 1024;
  let byteUnits = [" kB", " MB", " GB", " TB", "PB", "EB", "ZB", "YB"];
  do {
    byteSize /= unit;
    i++;
  } while (byteSize > unit);

  return Math.max(byteSize, 0.1).toFixed(1) + byteUnits[i];
}
