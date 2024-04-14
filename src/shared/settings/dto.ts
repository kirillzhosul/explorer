export type SettingsDTO = {
  pinned: string[];
  hideDottedFiles: boolean;
  hideSystem: boolean;
  hideHidden: boolean;
  displayIcons: boolean;
  displayFooter: boolean;
};

export type SettingsKey = keyof SettingsDTO;
