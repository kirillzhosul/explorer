// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use disk_list;
use opener;
use std::fs;
use std::fs::File;
use std::os::windows::fs::MetadataExt;
use std::path::Path;
use std::process::Command;

use glob::glob;

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
}

#[tauri::command]
fn execute_file(path: &str) {
    println!("Open (backend): {}", path);
    opener::open(path).unwrap();
}

#[tauri::command]
fn get_disk_list() -> Vec<Vec<String>> {
    disk_list::get_disk_list()
}

// TODO: Implement
#[tauri::command]
fn get_windows_link_info() {}

// TODO: Implement
#[tauri::command]
fn rename_item() {}

#[tauri::command]
fn create_directory<'a>(path: &'a str, name: &'a str) -> Result<&'a str, String> {
    fs::create_dir(path.to_owned() + "\\" + name).map_err(|err| err.to_string())?;

    Ok(path)
}

#[tauri::command]
fn create_text_file<'a>(path: &'a str, name: &'a str) -> Result<&'a str, String> {
    File::create(path.to_owned() + "\\" + name).map_err(|err| err.to_string())?;
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

    Ok(ItemEntry {
        path: Path::new(path).display().to_string(),
        type_: if meta.is_dir() { "directory" } else { "file" },
        readonly: meta.permissions().readonly(),
        attributes: ItemEntryAttributes {
            windows: meta.file_attributes(),
        },
        file_size: meta.file_size(),
    })
}

#[tauri::command]
fn search_glob(path_with_pattern: &str) -> Result<Vec<ItemEntry>, String> {
    let mut buf = vec![];
    let paths = glob(path_with_pattern).map_err(|err| err.to_string())?;
    for raw_path in paths {
        let path = raw_path.map_err(|err| err.to_string())?;
        let path_str = path.display().to_string();
        let meta = fs::metadata(path).map_err(|err| err.to_string())?;
        buf.push(ItemEntry {
            readonly: meta.permissions().readonly(),
            path: path_str,
            type_: if meta.is_dir() { "directory" } else { "file" },
            attributes: ItemEntryAttributes {
                windows: meta.file_attributes(),
            },
            file_size: meta.file_size(),
        })
    }

    Ok(buf)
}

#[tauri::command]
fn list_directory(path: &str) -> Result<Vec<ItemEntry>, String> {
    let mut buf = vec![];
    let entries = fs::read_dir(path).map_err(|err| err.to_string())?;
    for entry in entries {
        let entry = entry.unwrap();
        let meta = entry.metadata().unwrap();
        buf.push(ItemEntry {
            readonly: meta.permissions().readonly(),
            path: entry.path().display().to_string(),
            type_: if meta.is_dir() { "directory" } else { "file" },
            attributes: ItemEntryAttributes {
                windows: meta.file_attributes(),
            },
            file_size: meta.file_size(),
        })
    }

    Ok(buf)
}

fn main() {
    tauri::Builder::default()
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
            search_glob
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
