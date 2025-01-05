use std::sync::Mutex;

use tauri::Manager;

// use serde::{Deserialize, Serialize};
// use specta_typescript::Typescript;
// use tauri_specta::{collect_commands, Builder};

#[cfg(desktop)]
mod app_updates {
    use serde::Serialize;
    use specta::Type;
    use std::sync::Mutex;
    use tauri::{ipc::Channel, AppHandle, State};
    use tauri_plugin_updater::{Update, UpdaterExt};

    #[derive(Debug, thiserror::Error)]
    pub enum Error {
        #[error(transparent)]
        Updater(#[from] tauri_plugin_updater::Error),
        #[error("there is no pending update")]
        NoPendingUpdate,
    }

    impl Serialize for Error {
        fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
        where
            S: serde::Serializer,
        {
            serializer.serialize_str(self.to_string().as_str())
        }
    }

    type Result<T> = std::result::Result<T, Error>;

    #[derive(Clone, Serialize, Type)]
    #[serde(tag = "event", content = "data")]
    pub enum DownloadEvent {
        #[serde(rename_all = "camelCase")]
        Started {
            content_length: Option<u64>,
        },
        #[serde(rename_all = "camelCase")]
        Progress {
            chunk_length: usize,
        },
        Finished,
    }

    #[derive(Serialize, Type)]
    #[serde(rename_all = "camelCase")]
    pub struct UpdateMetadata {
        version: String,
        current_version: String,
    }

    #[tauri::command]
    // #[specta::specta]
    pub async fn fetch_update(
        app: AppHandle,
        pending_update: State<'_, PendingUpdate>,
    ) -> Result<Option<UpdateMetadata>> {
        // let channel = "stable";
        let url = tauri::Url::parse(&format!(
            // "https://cdn.myupdater.com/{{{{target}}}}-{{{{arch}}}}/{{{{current_version}}}}?channel={channel}",
            // "https://"
            "https://github.com/johncarmack1984/my-tauri-updater/releases/latest/download/latest.json"
        )).expect("invalid URL");

        let update = app
            .updater_builder()
            .endpoints(vec![url])?
            .build()?
            .check()
            .await?;

        let update_metadata = update.as_ref().map(|update| UpdateMetadata {
            version: update.version.clone(),
            current_version: update.current_version.clone(),
        });

        *pending_update.0.lock().unwrap() = update;

        Ok(update_metadata)
    }

    #[tauri::command]
    // #[specta::specta]
    pub async fn install_update(
        pending_update: State<'_, PendingUpdate>,
        on_event: Channel<DownloadEvent>,
    ) -> Result<()> {
        let Some(update) = pending_update.0.lock().unwrap().take() else {
            return Err(Error::NoPendingUpdate);
        };

        let mut started = false;

        update
            .download_and_install(
                |chunk_length, content_length| {
                    if !started {
                        let _ = on_event.send(DownloadEvent::Started { content_length });
                        started = true;
                    }

                    let _ = on_event.send(DownloadEvent::Progress { chunk_length });
                },
                || {
                    let _ = on_event.send(DownloadEvent::Finished);
                },
            )
            .await?;

        Ok(())
    }

    // #[derive(Clone, Serialize, Type)]
    pub struct PendingUpdate(pub Mutex<Option<Update>>);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // use app_updates::{fetch_update, install_update};
    // let builder = Builder::<tauri::Wry>::new()
    //     // Then register them (separated by a comma)
    //     .commands(collect_commands![fetch_update, install_update]);

    // #[cfg(desktop)] // <- Only export on desktop
    // #[cfg(debug_assertions)] // <- Only export on non-release builds
    // builder
    //     .export(Typescript::default(), "../src/bindings.ts")
    //     .expect("Failed to export typescript bindings");

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .setup(|app| {
            #[cfg(desktop)]
            {
                let _ = app
                    .handle()
                    .plugin(tauri_plugin_updater::Builder::new().build());
                app.manage(app_updates::PendingUpdate(Mutex::new(None)));
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            #[cfg(desktop)]
            app_updates::fetch_update,
            #[cfg(desktop)]
            app_updates::install_update
        ])
        // .invoke_handler(builder.invoke_handler())
        // .setup(move |app| {
        //     builder.mount_events(app);
        //     Ok(())
        // })
        .run(tauri::generate_context!())
        .expect("failed to run app");
}
