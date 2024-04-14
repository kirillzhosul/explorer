export type SettingsDTO = {
  pinned: string[];
  hideDottedFiles: boolean;
  hideSystem: boolean;
  hideHidden: boolean;
  displayIcons: boolean;
  displayFooter: boolean;
  viewAs: number; // TODO: Enum type
};

export type SettingsKey = keyof SettingsDTO;
