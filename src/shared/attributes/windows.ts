// https://learn.microsoft.com/en-us/windows/win32/fileio/file-attribute-constants
export type WINDOWS_ATTRIBUTES = {
  // TODO: Not all attributes covered
  readonly: boolean;
  hidden: boolean;
  system: boolean;
  archive: boolean;
  device: boolean;
  normal: boolean;
  temporary: boolean;
};

export const parseWindowsAttributes = (
  byteAttributes: number
): WINDOWS_ATTRIBUTES => {
  return {
    readonly: Boolean(byteAttributes & 0x00000001),
    hidden: Boolean(byteAttributes & 0x00000002),
    system: Boolean(byteAttributes & 0x00000004),
    archive: Boolean(byteAttributes & 0x00000020),
    device: Boolean(byteAttributes & 0x000000040),
    normal: Boolean(byteAttributes & 0x00000080),
    temporary: Boolean(byteAttributes & 0x00000100),
  };
};
