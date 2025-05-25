// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[cfg(desktop)]
mod app_updates;

use tauri::{App, Runtime};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    run_app(tauri::Builder::default(), |_app| {}).await
}

pub async fn run_app<R: Runtime, F: FnOnce(&App<R>) + Send + 'static>(
    mut builder: tauri::Builder<R>,
    setup: F,
) {
    let mut router: taurpc::Router<R> = taurpc::Router::new().export_config(
        specta_typescript::Typescript::default()
            .header("// My header\n")
            .bigint(specta_typescript::BigIntExportBehavior::String),
    );

    #[cfg(desktop)]
    {
        use app_updates::{PendingUpdate, Updatable};
        let updater = PendingUpdate::default();
        let update_handler = updater.lock().await.clone().into_handler();
        builder = builder
            .plugin(tauri_plugin_updater::Builder::new().build())
            .manage(updater);
        router = router.merge(update_handler);
    }

    builder
        .plugin(tauri_plugin_process::init())
        .setup(|app| setup_app(app, setup))
        .invoke_handler(router.into_handler())
        .run(tauri::generate_context!())
        .expect("failed to run app");
}

fn setup_app<R: Runtime, F: FnOnce(&App<R>) + Send + 'static>(
    app: &App<R>,
    setup: F,
) -> Result<(), Box<dyn std::error::Error>> {
    setup(app);
    Ok(())
}
