import { ITEM_TYPE } from "../../model";

const _ICON_ARCHIVE = "/icons/extensions/abstract/archive.png";
const _ICON_CODE = "/icons/extensions/abstract/code.png";
const _ICON_IMAGE = "/icons/extensions/abstract/image.png";
const _ICON_TEXT = "/icons/extensions/abstract/text.png";

const ICON_OVERRIDES_BY_EXTENSION = new Map<string, string>();
ICON_OVERRIDES_BY_EXTENSION.set("zip", "/icons/extensions/zip.png");
ICON_OVERRIDES_BY_EXTENSION.set("zip", "/icons/extensions/zip.png");
ICON_OVERRIDES_BY_EXTENSION.set("rar", _ICON_ARCHIVE);
ICON_OVERRIDES_BY_EXTENSION.set("tar", _ICON_ARCHIVE);
ICON_OVERRIDES_BY_EXTENSION.set("png", _ICON_IMAGE);
ICON_OVERRIDES_BY_EXTENSION.set("jpg", _ICON_IMAGE);
ICON_OVERRIDES_BY_EXTENSION.set("ts", _ICON_CODE);
ICON_OVERRIDES_BY_EXTENSION.set("tsx", _ICON_CODE);
ICON_OVERRIDES_BY_EXTENSION.set("js", _ICON_CODE);
ICON_OVERRIDES_BY_EXTENSION.set("rs", _ICON_CODE);
ICON_OVERRIDES_BY_EXTENSION.set("py", _ICON_CODE);
ICON_OVERRIDES_BY_EXTENSION.set("css", _ICON_CODE);
ICON_OVERRIDES_BY_EXTENSION.set("md", _ICON_TEXT);
ICON_OVERRIDES_BY_EXTENSION.set("docx", _ICON_TEXT);
ICON_OVERRIDES_BY_EXTENSION.set("txt", _ICON_TEXT);

const ICON_BY_TYPE = new Map<ITEM_TYPE, string>();
ICON_BY_TYPE.set(ITEM_TYPE.directory, "/icons/directory.png");
ICON_BY_TYPE.set(ITEM_TYPE.drive, "/icons/drive.png");
ICON_BY_TYPE.set(ITEM_TYPE.file, "/icons/file.png");

export { ICON_OVERRIDES_BY_EXTENSION, ICON_BY_TYPE };
