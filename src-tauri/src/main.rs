// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[cfg(target_os = "windows")]
use disk_list;
#[cfg(target_os = "windows")]
use std::os::windows::fs::MetadataExt;


mod application_state;
mod initial_params;

use glob::glob;
use opener;
use std::fs;
use std::fs::File;

use std::path::Path;
use std::process::Command;
use tauri::{CustomMenuItem, Manager, SystemTrayMenu, SystemTrayMenuItem};
use tauri::{SystemTray, SystemTrayEvent};

#[derive(serde::Serialize)]
struct ItemEntry<'a> {
    path: String,
    type_: &'a str,
    readonly: bool,
    attributes: ItemEntryAttributes,
    file_size: u64,
}
#[derive(serde::Serialize)]
struct ItemEntryAttributes {
    windows: u32,
    linux: u32,
}

#[cfg(target_os = "windows")]
fn item_entry_from_os_meta(path: &Path, meta: fs::Metadata) -> ItemEntry<'static> {
    return ItemEntry {
        path: path.display().to_string(),
        type_: if meta.is_dir() { "directory" } else { "file" },
        readonly: meta.permissions().readonly(),
        attributes: ItemEntryAttributes {
            windows: meta.file_attributes(),
            linux: 0,
        },
        file_size: meta.file_size(),
    };
}

#[cfg(target_os = "linux")]
fn item_entry_from_os_meta(path: &Path, meta: fs::Metadata) -> ItemEntry<'static> {
    use std::os::unix::fs::MetadataExt;

    return ItemEntry {
        path: path.display().to_string(),
        type_: if meta.is_dir() { "directory" } else { "file" },
        readonly: meta.permissions().readonly(),
        attributes: ItemEntryAttributes {
            windows: 0,
            linux: 0,
        },
        file_size: meta.size(),
    };
}

#[cfg(target_os = "macos")]
fn item_entry_from_os_meta(path: &Path, meta: fs::Metadata) -> ItemEntry<'static> {

    return ItemEntry {
        path: path.display().to_string(),
        type_: if meta.is_dir() { "directory" } else { "file" },
        readonly: meta.permissions().readonly(),
        attributes: ItemEntryAttributes {
            windows: 0,
            linux: 0,
        },
        file_size: meta.len(),
    };
}
#[tauri::command]
fn execute_file(path: &str) {
    println!("Open (backend): {}", path);
    opener::open(path).unwrap();
}

#[tauri::command]
#[cfg(target_os = "linux")]
fn get_disk_list() -> Vec<Vec<String>> {

    let output = Command::new("df")
        .arg("-h")
        .arg("/")
        .output()
        .expect("Failed to execute command");

    let output_str = String::from_utf8_lossy(&output.stdout);
    let lines: Vec<&str> = output_str.split('\n').collect();
    let root_info: Vec<&str> = lines[1].split_whitespace().collect();

    vec![vec![
        "System Mount Point".to_string(),
        root_info[0].to_string(),
        root_info[5].to_string(),
        root_info[1].to_string(),
        root_info[3].to_string(),
    ]]
}

#[tauri::command]
#[cfg(target_os = "windows")]
fn get_disk_list() -> Vec<Vec<String>> {
    disk_list::get_disk_list()
}

#[tauri::command]
#[cfg(target_os = "macos")]
fn get_disk_list() -> Vec<Vec<String>> {

    let output = Command::new("df")
        .arg("-h")
        .arg("/")
        .output()
        .expect("Failed to execute command");

    let output_str = String::from_utf8_lossy(&output.stdout);
    let lines: Vec<&str> = output_str.split('\n').collect();
    let root_info: Vec<&str> = lines[1].split_whitespace().collect();

    vec![vec![
        "System Mount Point".to_string(),
        root_info[0].to_string(),
        root_info[8].to_string(),
        root_info[1].to_string(),
        root_info[3].to_string(),
    ]]
}
// TODO: Implement
#[tauri::command]
fn get_windows_link_info() {}

// TODO: Implement
#[tauri::command]
fn rename_item() {}

#[tauri::command]
#[cfg(target_os = "windows")]
fn create_directory<'a>(path: &'a str, name: &'a str) -> Result<&'a str, String> {
    fs::create_dir(path.to_owned() + "\\" + name).map_err(|err| err.to_string())?;

    Ok(path)
}

#[tauri::command]
#[cfg(target_os = "windows")]
fn create_text_file<'a>(path: &'a str, name: &'a str) -> Result<&'a str, String> {
    File::create(path.to_owned() + "\\" + name).map_err(|err| err.to_string())?;
    Ok(path)
}



#[tauri::command]
#[cfg(target_os = "macos")]
fn create_directory<'a>(path: &'a str, name: &'a str) -> Result<&'a str, String> {
    fs::create_dir(path.to_owned() + "/" + name).map_err(|err| err.to_string())?;

    Ok(path)
}

#[tauri::command]
#[cfg(target_os = "macos")]
fn create_text_file<'a>(path: &'a str, name: &'a str) -> Result<&'a str, String> {
    File::create(path.to_owned() + "/" + name).map_err(|err| err.to_string())?;
    Ok(path)
}

#[tauri::command]
#[cfg(target_os = "linux")]
fn create_directory<'a>(path: &'a str, name: &'a str) -> Result<&'a str, String> {
    fs::create_dir(path.to_owned() + "/" + name).map_err(|err| err.to_string())?;

    Ok(path)
}

#[tauri::command]
#[cfg(target_os = "linux")]
fn create_text_file<'a>(path: &'a str, name: &'a str) -> Result<&'a str, String> {
    File::create(path.to_owned() + "/" + name).map_err(|err| err.to_string())?;
    Ok(path)
}

#[tauri::command]
fn delete_item<'a>(path: &'a str) -> Result<&'a str, String> {
    let meta = fs::metadata(path).map_err(|err| err.to_string())?;
    if meta.is_dir() {
        fs::remove_dir_all(path).map_err(|err| err.to_string())?;
    } else {
        fs::remove_file(path).map_err(|err| err.to_string())?;
    }

    Ok(path)
}

//TODO! Not used anymore
#[tauri::command]
fn open_terminal_in_directory(path: &str) {
    println!("Open (terminal backend): {}", path);
    Command::new("start")
        .arg("cmd")
        .arg("/K")
        .arg("cd".to_owned() + path)
        .spawn()
        .expect("Failed to execute command");
}

#[tauri::command]
fn get_item_info(path: &str) -> Result<ItemEntry, String> {
    let meta = fs::metadata(path).map_err(|err| err.to_string())?;

    Ok(item_entry_from_os_meta(Path::new(path), meta))
}

fn search_glob_plain_for_path(path_with_pattern: &str) -> Result<Vec<ItemEntry>, String> {
    let mut buf = vec![];
    let paths = glob(path_with_pattern).map_err(|err| err.to_string())?;
    for raw_path in paths {
        let path = raw_path.map_err(|err| err.to_string())?;

        buf.push(item_entry_from_os_meta(
            Path::new(&path.display().to_string()),
            fs::metadata(path).map_err(|err| err.to_string())?,
        ));
    }

    Ok(buf)
}

#[tauri::command]
fn search_glob(path_with_pattern: &str, recurse: bool) -> Result<Vec<ItemEntry>, String> {
    if recurse {
        unimplemented!()
    } else {
        Ok(search_glob_plain_for_path(path_with_pattern).map_err(|err| err.to_string())?)
    }
}

#[tauri::command]
fn list_directory(path: &str) -> Result<Vec<ItemEntry>, String> {
    let mut buf = vec![];
    let entries = fs::read_dir(path).map_err(|err| err.to_string())?;
    for entry in entries {
        let entry = entry.unwrap();

        buf.push(item_entry_from_os_meta(
            Path::new(&entry.path().display().to_string()),
            entry.metadata().unwrap(),
        ));
    }

    Ok(buf)
}

fn build_tray_menu() -> SystemTrayMenu {
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");

    SystemTrayMenu::new()
        .add_item(quit)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(hide)
}

fn main() {
    tauri::Builder::default()
        .system_tray(SystemTray::new().with_menu(build_tray_menu()))
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                event.window().hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::LeftClick { .. } => {
                app.get_window("main").unwrap().show().unwrap();
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "quit" => {
                    std::process::exit(0);
                }
                "hide" => {
                    app.get_window("main").unwrap().hide().unwrap();
                }
                _ => {}
            },
            _ => {}
        })
        .setup(|app| {
            #[cfg(debug_assertions)] // only include this code on debug builds
            {
                let window = app.get_window("main").unwrap();
                window.open_devtools();
                window.close_devtools();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            list_directory,
            execute_file,
            get_disk_list,
            open_terminal_in_directory,
            delete_item,
            create_directory,
            create_text_file,
            get_item_info,
            rename_item,
            get_item_info,
            get_windows_link_info,
            search_glob,
            initial_params::query_initial_params
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
