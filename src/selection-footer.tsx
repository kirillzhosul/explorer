type SELECTION_FOOTER_PROPS = {
  itemsCount: number;
  selectedCount: number;
  selectionSize: number;
};

export function SelectionFooter({
  itemsCount,
  selectedCount,
  selectionSize,
}: SELECTION_FOOTER_PROPS) {
  /**
   * Footer that display selection information
   */
  return (
    <div className="selection-footer" style={{}}>
      <span className="selection-footer-text">
        {itemsCount} items{" "}
        {selectedCount > 0 && <>| {selectedCount} items selected</>} |{" "}
        {selectionSize}
      </span>
    </div>
  );
}
