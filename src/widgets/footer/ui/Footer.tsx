import { getReadableFileSizeString } from "../../../shared/size";
import styles from "./Footer.module.css";

type SELECTION_FOOTER_PROPS = {
  itemsCount: number;
  selectedCount: number;
  selectionSize: number;
};

export function Footer({
  itemsCount,
  selectedCount,
  selectionSize,
}: SELECTION_FOOTER_PROPS) {
  return (
    <div className={styles.container}>
      <span className={styles.row}>
        {itemsCount} items{" "}
        {selectedCount > 0 && (
          <>
            | {selectedCount} items selected{" "}
            {getReadableFileSizeString(selectionSize)} |
          </>
        )}
      </span>
    </div>
  );
}
