/**
 * Searching implementation
 */

use crate::item_entry;

use glob::glob;
use std::path::Path;
use std::fs;

#[tauri::command]
pub fn search_glob(path_with_pattern: &str, recurse: bool) -> Result<Vec<item_entry::ItemEntry>, String> {
    if recurse {
        unimplemented!()
    } else {
        Ok(search_glob_plain_for_path(path_with_pattern).map_err(|err| err.to_string())?)
    }
}

fn search_glob_plain_for_path(path_with_pattern: &str) -> Result<Vec<item_entry::ItemEntry>, String> {
    let mut buf = vec![];
    let paths = glob(path_with_pattern).map_err(|err| err.to_string())?;
    for raw_path in paths {
        let path = raw_path.map_err(|err| err.to_string())?;

        buf.push(item_entry::item_entry_from_os_meta(
            Path::new(&path.display().to_string()),
            fs::metadata(path).map_err(|err| err.to_string())?,
        ));
    }

    Ok(buf)
}
