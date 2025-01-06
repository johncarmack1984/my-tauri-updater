// use serde::{Deserialize, Serialize};
// use specta_typescript::Typescript;
// use tauri_specta::{collect_commands, Builder};
use app_updates::{PendingUpdate, Updatable};
use tauri::Manager;

#[cfg(desktop)]
mod app_updates;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
#[tokio::main]
pub async fn run() {
    let updater = PendingUpdate::default();
    let update_handler = updater.lock().await.clone().into_handler();
    let router = taurpc::Router::new()
        .export_config(
            specta_typescript::Typescript::default()
                .remove_default_header()
                .header("// My header\n")
                .bigint(specta_typescript::BigIntExportBehavior::String),
        )
        .merge(update_handler);

    tauri::Builder::default()
        .setup(|app| {
            #[cfg(desktop)]
            {
                let _ = app
                    .handle()
                    .plugin(tauri_plugin_updater::Builder::new().build());
                app.manage(updater);
            }
            Ok(())
        })
        .invoke_handler(router.into_handler())
        .run(tauri::generate_context!())
        .expect("failed to run app");
}
