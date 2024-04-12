// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use disk_list;
use opener;
use std::path::Path;
use std::process::Command;
use std::{fs, path::PathBuf};

#[derive(serde::Serialize)]
struct ItemEntry<'a> {
    path: PathBuf,
    type_: &'a str,
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
        path: Path::new(path).to_path_buf(),
        type_: if meta.is_dir() { "dir" } else { "file" },
    })
}

#[tauri::command]
fn list_directory(path: &str) -> Result<Vec<ItemEntry>, String> {
    let mut buf = vec![];
    let entries = fs::read_dir(path).map_err(|err| err.to_string())?;
    for entry in entries {
        let entry = entry.unwrap();
        let meta = entry.metadata().unwrap();
        buf.push(ItemEntry {
            path: entry.path(),
            type_: if meta.is_dir() { "dir" } else { "file" },
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
            get_item_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
