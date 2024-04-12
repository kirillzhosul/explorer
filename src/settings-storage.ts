import { useEffect, useState } from "react";

type SettingsDTO = {
  bookmarkedPaths: string[];
};

interface BaseSettingsStorage {
  load(): SettingsDTO;
  save(dto: SettingsDTO): void;
}

export class LocalStorageSettingsStorage implements BaseSettingsStorage {
  load(): SettingsDTO {
    return {
      bookmarkedPaths: JSON.parse(localStorage.getItem("favorites") ?? "[]"),
    };
  }

  save(dto: SettingsDTO): void {
    localStorage.setItem("favorites", JSON.stringify(dto.bookmarkedPaths));
  }
}

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
