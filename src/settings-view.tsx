import { SettingsDTO } from "./settings-storage";

export function SettingsView({
  setSettings,
  settings,
}: {
  setSettings: (dto: SettingsDTO) => any;
  settings: SettingsDTO;
}) {
  return (
    <div className="settings-view">
      <div>
        <h4>Settings</h4>

        <h5>Filters && sorting</h5>
        <p>
          <input type="checkbox" disabled={true} checked={true}></input> Display
          extensions
        </p>
        <p>
          <input
            type="checkbox"
            checked={settings.hideDottedFiles}
            onChange={() => {
              setSettings({
                ...settings,
                hideDottedFiles: !settings.hideDottedFiles,
              });
            }}
          ></input>{" "}
          Hide dotted files
        </p>
        <p>
          <input
            type="checkbox"
            checked={settings.hideSystem}
            onChange={() => {
              setSettings({
                ...settings,
                hideSystem: !settings.hideSystem,
              });
            }}
          ></input>{" "}
          Hide system files
        </p>
        <p>
          <input
            type="checkbox"
            checked={settings.hideHidden}
            onChange={() => {
              setSettings({
                ...settings,
                hideHidden: !settings.hideHidden,
              });
            }}
          ></input>{" "}
          Hide hidden files
        </p>
        <h5>Display appearance</h5>
        <p>
          <input
            type="checkbox"
            checked={settings.displayIcons}
            onChange={() => {
              setSettings({
                ...settings,
                displayIcons: !settings.displayIcons,
              });
            }}
          ></input>{" "}
          Display icons
        </p>
        <p>
          <input
            type="checkbox"
            checked={settings.displayFooter}
            onChange={() => {
              setSettings({
                ...settings,
                displayFooter: !settings.displayFooter,
              });
            }}
          ></input>{" "}
          Display selection footer
        </p>
      </div>
      <hr />
      <div>
        <h4>About this application</h4>
        <p>Version: 0.0.0</p>
        <p>License: MIT</p>
        <p>Author: Kirill Zhosul</p>
      </div>
    </div>
  );
}
