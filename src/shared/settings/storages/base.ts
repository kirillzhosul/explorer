import { SettingsDTO } from "../dto";

export interface BaseSettingsStorage {
  load(): SettingsDTO;
  save(dto: SettingsDTO): void;
}
