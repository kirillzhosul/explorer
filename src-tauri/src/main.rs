// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


mod application_state;
mod initial_params;
mod search;
mod item_entry;
mod disk_list_executor;

use opener;
use std::fs;
use std::fs::File;

use std::path::Path;
use std::process::Command;
use tauri::{CustomMenuItem, Manager, SystemTrayMenu, SystemTrayMenuItem};
use tauri::{SystemTray, SystemTrayEvent};



#[tauri::command]
fn execute_file(path: &str) {
    println!("Open (backend): {}", path);
    opener::open(path).unwrap();
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
fn get_item_info(path: &str) -> Result<item_entry::ItemEntry, String> {
    let meta = fs::metadata(path).map_err(|err| err.to_string())?;

    Ok(item_entry::item_entry_from_os_meta(Path::new(path), meta))
}

#[tauri::command]
fn list_directory(path: &str) -> Result<Vec<item_entry::ItemEntry>, String> {
    let mut buf = vec![];
    let entries = fs::read_dir(path).map_err(|err| err.to_string())?;
    for entry in entries {
        let entry = entry.unwrap();

        buf.push( item_entry::item_entry_from_os_meta(
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
            disk_list_executor::get_disk_list,
            open_terminal_in_directory,
            delete_item,
            create_directory,
            create_text_file,
            get_item_info,
            rename_item,
            get_item_info,
            get_windows_link_info,
            search::search_glob,
            initial_params::query_initial_params
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
