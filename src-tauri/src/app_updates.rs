use serde::{Deserialize, Serialize};
use specta::Type;
use tauri::{AppHandle, Manager, Runtime, ipc::Channel};
use tauri_plugin_updater::{Update, UpdaterExt};
use tokio::sync::Mutex;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    Updater(#[from] tauri_plugin_updater::Error),
    // #[error("there is no pending update")]
    // NoPendingUpdate,
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> std::result::Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(self.to_string().as_str())
    }
}

// type Result<T> = std::result::Result<T, Error>;

#[derive(Clone, Serialize, Deserialize, Type)]
#[serde(tag = "event", content = "data", rename_all = "camelCase")]
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

#[derive(Clone, Serialize, Deserialize, Type)]
#[serde(rename_all = "camelCase")]
pub struct UpdateMetadata {
    version: String,
    current_version: String,
}

#[taurpc::procedures(event_trigger = UpdateEventTrigger, export_to = "../src/bindings.ts")]
pub trait Updatable {
    async fn fetch_update<R: Runtime>(app_handle: AppHandle<R>) -> Option<UpdateMetadata>;
    async fn install_update<R: Runtime>(
        app_handle: AppHandle<R>,
        on_event: Channel<DownloadEvent>,
    ) -> ();
}

#[taurpc::ipc_type]
pub struct PendingUpdateState {
    pub state: Option<Update>,
}

impl Default for PendingUpdateState {
    fn default() -> Self {
        Self {
            state: None::<Update>,
        }
    }
}

pub type PendingUpdate = Mutex<PendingUpdateState>;

#[taurpc::resolvers]
impl Updatable for PendingUpdateState {
    async fn fetch_update<R: Runtime>(self, app_handle: AppHandle<R>) -> Option<UpdateMetadata> {
        let url = tauri::Url::parse(&format!(
            "https://github.com/johncarmack1984/my-tauri-updater/releases/latest/download/latest.json"
        ))
        .expect("invalid URL");

        let mut builder = match app_handle.updater_builder().endpoints(vec![url]) {
            Ok(endpoints) => endpoints,
            Err(e) => {
                eprintln!("Error fetching update: {}", e);
                return None::<UpdateMetadata>;
            }
        };

        builder = builder.version_comparator(|current, update| update.version > current);

        let updater = match builder.build() {
            Ok(builder) => builder,
            Err(e) => {
                eprintln!("Error fetching update: {}", e);
                return None::<UpdateMetadata>;
            }
        };

        let update = match updater.check().await {
            Ok(opt) => match opt {
                Some(update) => update,
                None => {
                    eprintln!("No update found");
                    return None::<UpdateMetadata>;
                }
            },
            Err(e) => {
                eprintln!("Error fetching update: {}", e);
                return None::<UpdateMetadata>;
            }
        };

        let update_metadata = Some(UpdateMetadata {
            version: update.version.clone(),
            current_version: update.current_version.clone(),
        });

        app_handle
            .state::<PendingUpdate>()
            .inner()
            .lock()
            .await
            .state = Some(update);

        update_metadata
    }

    async fn install_update<R: Runtime>(
        self,
        app_handle: AppHandle<R>,
        on_event: Channel<DownloadEvent>,
    ) -> () {
        let pending_update = app_handle.state::<PendingUpdate>();

        let Some(update) = pending_update.lock().await.state.clone() else {
            return;
        };

        let mut started = false;

        match update
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
            .await
        {
            Ok(()) => {
                // app_handle.request_restart();
            }
            Err(e) => {
                eprintln!("Error downloading update: {}", e);
            }
        };

        ()
    }
}
