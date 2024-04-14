import { SettingsDTO } from "../dto";
import { readSettingEntry, saveSettingEntry } from "../utils";
import { BaseSettingsStorage } from "./base";

export class LocalStorageSettingsStorage implements BaseSettingsStorage {
  // TODO: use something like keyof
  load(): SettingsDTO {
    return {
      hideDottedFiles: readSettingEntry("hideDottedFiles", false),
      displayIcons: readSettingEntry("displayIcons", true),
      displayFooter: readSettingEntry("displayFooter", true),
      hideSystem: readSettingEntry("hideSystem", false),
      hideHidden: readSettingEntry("hideHidden", false),
      pinned: readSettingEntry("pinned", []),
    };
  }

  save(dto: SettingsDTO): void {
    saveSettingEntry("pinned", dto.pinned);
    saveSettingEntry("hideDottedFiles", dto.hideDottedFiles);
    saveSettingEntry("displayFooter", dto.displayFooter);
    saveSettingEntry("displayIcons", dto.displayIcons);
    saveSettingEntry("hideSystem", dto.hideSystem);
    saveSettingEntry("hideHidden", dto.hideHidden);
  }
}
