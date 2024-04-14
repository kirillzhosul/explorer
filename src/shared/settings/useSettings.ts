import { useEffect, useState } from "react";
import { BaseSettingsStorage, LocalStorageSettingsStorage } from "./storages";
import { SettingsDTO } from "./dto";

export const useSettings = (
  backend: new (
    ...args: any[]
  ) => BaseSettingsStorage = LocalStorageSettingsStorage
) => {
  // TODO: Use context
  // TODO: Loads every time

  const backendImplementation = new backend();
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
