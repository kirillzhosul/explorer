// TODO: Relates to local storage
export function readSettingEntry(key: string, defaultValue: any) {
  try {
    return JSON.parse(
      localStorage.getItem(key) ?? JSON.stringify(defaultValue)
    );
  } catch {
    return defaultValue;
  }
}

export function saveSettingEntry(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}
