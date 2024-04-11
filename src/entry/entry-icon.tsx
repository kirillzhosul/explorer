import { ENTRY_TYPE } from "./types";

type EntryIconProps = { type: ENTRY_TYPE };

export function EntryIcon({ type }: EntryIconProps) {
  /**
   * Icon image for the entry
   * determined by provided type
   */
  if (type == "dir") {
    return <img src="/public/directory.png" className="entry-icon" />;
  }
  if (type == "file") {
    return <img src="/public/file.png" className="entry-icon" />;
  }

  if (type == "disk") {
    return <img src="/public/disk.png" className="entry-icon" />;
  }
  throw Error(`Unknown entry icon type! ${type}`);
}
