import { ITEM_TYPE } from "@@entities/item";
import {
  ICON_BY_TYPE,
  ICON_OVERRIDES_BY_EXTENSION,
} from "@@shared/iconOverrides";
import styles from "./ItemIcon.module.css";

type ITEM_ICON_PROPS = { type: ITEM_TYPE; extension?: string };

export function ItemIcon({ type, extension }: ITEM_ICON_PROPS) {
  let iconPath = ICON_OVERRIDES_BY_EXTENSION.get(extension ?? "");

  if (!iconPath) {
    iconPath = ICON_BY_TYPE.get(type);
  }

  if (iconPath) {
    return <img src={iconPath} className={styles.icon} />;
  }
  throw Error(`Unknown entry icon type! ${type}`);
}
