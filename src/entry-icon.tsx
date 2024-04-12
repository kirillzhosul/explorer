import { ENTRY_ICON_OVERRIDES } from "./entry-icon-overrides";
import { ENTRY_TYPE } from "./types";

type EntryIconProps = { type: ENTRY_TYPE; extension?: Extensions };

export type Extensions = keyof typeof ENTRY_ICON_OVERRIDES.by_extension | "";

export function EntryIcon({ type, extension }: EntryIconProps) {
  let iconPath = extension ? ENTRY_ICON_OVERRIDES.by_extension[extension] : "";

  if (!iconPath) {
    iconPath = ENTRY_ICON_OVERRIDES.by_type[type];
  }

  if (iconPath) {
    return <img src={iconPath} className="entry-icon" />;
  }
  throw Error(`Unknown entry icon type! ${type}`);
}
