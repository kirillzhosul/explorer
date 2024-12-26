
use std::fs;
use std::path::Path;



#[derive(serde::Serialize)]
pub struct ItemEntry<'a> {
    pub path: String,
    pub type_: &'a str,
    pub readonly: bool,
    pub attributes: ItemEntryAttributes,
    pub file_size: u64,
}

#[derive(serde::Serialize)]
pub struct ItemEntryAttributes {
    pub windows: u32,
    pub linux: u32,
    pub macos: u32,
}


#[cfg(target_os = "windows")]
pub fn item_entry_from_os_meta(path: &Path, meta: fs::Metadata) -> ItemEntry<'static> {
    use std::os::windows::fs::MetadataExt;

    return ItemEntry {
        path: path.display().to_string(),
        type_: internal_type_from_os_meta(&meta),
        readonly: meta.permissions().readonly(),
        attributes: item_entry::ItemEntryAttributes {
            windows: meta.file_attributes(),
            linux: 0,
            macos: 0,
        },
        file_size: meta.file_size(),
    };
}

#[cfg(target_os = "linux")]
pub fn item_entry_from_os_meta(path: &Path, meta: fs::Metadata) -> ItemEntry<'static> {
    use std::os::unix::fs::MetadataExt;

    return ItemEntry {
        path: path.display().to_string(),
        type_: internal_type_from_os_meta(&meta),
        readonly: meta.permissions().readonly(),
        attributes: ItemEntryAttributes {
            windows: 0,
            linux: 0,
            macos: 0,
        },
        file_size: meta.size(),
    };
}

#[cfg(target_os = "macos")]
pub fn item_entry_from_os_meta(path: &Path, meta: fs::Metadata) -> ItemEntry<'static> {
    return ItemEntry {
        path: path.display().to_string(),
        type_: internal_type_from_os_meta(&meta),
        readonly: meta.permissions().readonly(),
        attributes: ItemEntryAttributes {
            windows: 0,
            linux: 0,
            macos: 0,
        },
        file_size: meta.len(),
    };
}

fn internal_type_from_os_meta(meta: &fs::Metadata) -> &'static str {
    if meta.is_dir() {
        return "directory";
    } else {
        if meta.is_symlink() {
            return "symlink";
        }
        return "file";
    }
}
