/**
 * Initial params implementation
 *
 * Initial params - is system-wide information / specifications
 * that is used for frontend to determine how to behave
 */
use std::env::consts as env_consts;

#[derive(serde::Serialize)]
pub struct InitialParams {
    /**
     * Filesystem path style that is used to parse and display paths
     * (by default is applied to core FS only (any remote or other uses own FS style defined by session))
     *
     * Can be `unix` / `windows`
     */
    fs_path_style: String,
}

// TODO!: This command is actually not yet used by frontend
#[tauri::command]
pub fn query_initial_params() -> InitialParams {
    InitialParams {
        fs_path_style: env_consts::FAMILY.to_string(),
    }
}
