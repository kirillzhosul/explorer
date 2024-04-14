import { SettingsDTO } from "../../../shared/settings";
import styles from "./SettingsView.module.css";

type SETTINGS_VIEW_PROPS = {
  setSettings: (dto: SettingsDTO) => any;
  settings: SettingsDTO;
};

function About() {
  return (
    <div className={styles.about}>
      <div className={styles.header}>About this application</div>

      <p>Version: 0.0.0</p>
      <p>License: MIT</p>
      <p>Author: Kirill Zhosul</p>
    </div>
  );
}

function ToggleSettings({
  settings,
  setSettings,
  field,
  children,
}: {
  settings: SettingsDTO;
  setSettings: (settings: SettingsDTO) => any;
  field: keyof SettingsDTO;
  children: any;
}) {
  return (
    <div className={styles.setting}>
      <input
        type="checkbox"
        checked={settings[field] as boolean}
        onChange={() => {
          setSettings({
            ...settings,
            [field]: !settings[field],
          });
        }}
      ></input>{" "}
      {children}
    </div>
  );
}

function Settings({ setSettings, settings }: SETTINGS_VIEW_PROPS) {
  const toggleProps = {
    settings,
    setSettings,
  };
  return (
    <div className={styles.settings}>
      <div className={styles.header}>Settings</div>

      <ToggleSettings field={"hideSystem"} {...toggleProps}>
        Hide system files
      </ToggleSettings>

      <ToggleSettings field={"hideHidden"} {...toggleProps}>
        Hide hidden files
      </ToggleSettings>

      <ToggleSettings field={"displayIcons"} {...toggleProps}>
        Display icons
      </ToggleSettings>
      <ToggleSettings field={"displayFooter"} {...toggleProps}>
        Display footer
      </ToggleSettings>
    </div>
  );
}

export function SettingsView(props: SETTINGS_VIEW_PROPS) {
  return (
    <div className={styles.container}>
      <Settings {...props} />
      <About />
    </div>
  );
}
