import { useEffect, useState } from "react";

export type SettingsDTO = {
  bookmarkedPaths: string[];
  hideDottedFiles: boolean;
  hideSystem: boolean;
  hideHidden: boolean;
  displayIcons: boolean;
  displayFooter: boolean;
};

interface BaseSettingsStorage {
  load(): SettingsDTO;
  save(dto: SettingsDTO): void;
}

function readSettingEntry(key: string, defaultValue: any) {
  try {
    return JSON.parse(
      localStorage.getItem(key) ?? JSON.stringify(defaultValue)
    );
  } catch {
    return defaultValue;
  }
}
export class LocalStorageSettingsStorage implements BaseSettingsStorage {
  load(): SettingsDTO {
    return {
      hideDottedFiles: readSettingEntry("hideDottedFiles", false),
      displayIcons: readSettingEntry("displayIcons", true),
      displayFooter: readSettingEntry("displayFooter", true),
      hideSystem: readSettingEntry("hideSystem", false),
      hideHidden: readSettingEntry("hideHidden", false),
      bookmarkedPaths: readSettingEntry("favorites", []),
    };
  }

  save(dto: SettingsDTO): void {
    localStorage.setItem("favorites", JSON.stringify(dto.bookmarkedPaths));
    localStorage.setItem(
      "hideDottedFiles",
      JSON.stringify(dto.hideDottedFiles)
    );
    localStorage.setItem("displayFooter", JSON.stringify(dto.displayFooter));
    localStorage.setItem("displayIcons", JSON.stringify(dto.displayIcons));
    localStorage.setItem("hideSystem", JSON.stringify(dto.hideSystem));
    localStorage.setItem("hideHidden", JSON.stringify(dto.hideHidden));
    console.log("[settingsStorage] saved");
  }
}

// TODO: Use context
export const useSettingsStorage = (
  backend: new (
    ...args: any[]
  ) => BaseSettingsStorage = LocalStorageSettingsStorage
) => {
  const backendImplementation = new backend();

  // TODO: Loads every time
  const [settings, setSettings] = useState<SettingsDTO>(
    backendImplementation.load()
  );

  const save = () => {
    if (!settings) {
      return;
    }
    backendImplementation.save(settings);
  };

  useEffect(() => {
    save();
  }, [settings]);

  return {
    settings,
    setSettings,
  };
};
