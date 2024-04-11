// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use disk_list;
use opener;
use std::{fs, path::PathBuf};
//use std::process::Command;

#[derive(serde::Serialize)]
struct ItemEntry<'a> {
    path: PathBuf,
    type_: &'a str,
}

#[tauri::command]
fn execute_file(path: &str) {
    //let str_path = "\"".to_string() + path + "\"";

    println!("Open (backend): {}", path);
    opener::open(path).unwrap();
    //let _ = Command::new("")
    //    .arg(str_path)
    //    .output()
    //    .expect("Failed to execute command");
    //assert_eq!(b"Hello world\n", output.stdout.as_slice());
}

#[tauri::command]
fn get_disk_list() -> Vec<Vec<String>> {
    let list = disk_list::get_disk_list();

    list
    //get disk info vec![vec![mount_from,file_type,mount_on,available_space,total_space]]
}
#[tauri::command]
fn list_directory(path: &str) -> Result<Vec<ItemEntry>, String> {
    let mut buf = vec![];
    let entries = fs::read_dir(path).unwrap();

    for entry in entries {
        let entry = entry.unwrap();
        let meta = entry.metadata().unwrap();

        // is_file
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
            get_disk_list
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
