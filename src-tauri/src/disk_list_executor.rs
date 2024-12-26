#[tauri::command]
#[cfg(any(target_os = "linux", target_os = "macos"))]
pub fn get_disk_list() -> Vec<Vec<String>> {
    use std::process::Command;


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
        "/".to_string(),
        root_info[1].to_string(),
        root_info[3].to_string(),
    ]]
}

#[tauri::command]
#[cfg(target_os = "windows")]
pub fn get_disk_list() -> Vec<Vec<String>> {
    use disk_list;
    disk_list::get_disk_list()
}
