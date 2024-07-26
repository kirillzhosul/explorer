import { getReadableFileSizeString } from "@@shared/lib/size";
import styles from "./Footer.module.css";

type SELECTION_FOOTER_PROPS = {
  itemsCount: number;
  selectedCount: number;
  selectionSize: number;
  selectionSizeAsSI: boolean
};

export function Footer({
  itemsCount,
  selectedCount,
  selectionSize,
  selectionSizeAsSI
}: SELECTION_FOOTER_PROPS) {
  return (
    <div className={styles.container}>
      <span className={styles.row}>
        {itemsCount} items{" "}
        {selectedCount > 0 && (
          <>
            | {selectedCount} items selected{" "}
            {getReadableFileSizeString(selectionSize, selectionSizeAsSI)} |
          </>
        )}
      </span>
    </div>
  );
}
