export function isTauriIPCSupported() {
    return window.__TAURI_IPC__ !== undefined &&
        window.__TAURI_METADATA__ !== undefined
}

export function TauriIPCMissing() {
    return <div style={{
        "textAlign": "center",
        "justifyContent": "center",
        "alignItems": "center",
        "alignContent": "center",
        "height": "100vh"
    }} id="ipc-missing-container">
        <p style={{ "color": "red", "fontSize": "200%" }}>Tauri IPC is missing! </p>
        <span>There is no support of running from browser / no Tauri environment at current moment! </span>
    </div>
}