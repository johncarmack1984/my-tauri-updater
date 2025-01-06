use serde::{Deserialize, Serialize};
use specta::Type;
use tauri::{ipc::Channel, AppHandle, Manager, Wry};
use tauri_plugin_updater::{Update, UpdaterExt};
use tokio::sync::Mutex;

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

#[derive(Clone, Serialize, Deserialize, Type)]
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

#[derive(Clone, Serialize, Deserialize, Type)]
#[serde(rename_all = "camelCase")]
pub struct UpdateMetadata {
    version: String,
    current_version: String,
}

#[taurpc::procedures(event_trigger = UpdateEventTrigger, export_to = "../src/bindings.ts")]
pub trait Updatable {
    async fn fetch_update(app_handle: AppHandle<Wry>) -> Result<Option<UpdateMetadata>>;
    async fn install_update(
        app_handle: AppHandle<Wry>,
        on_event: Channel<DownloadEvent>,
    ) -> Result<()>;
}

#[derive(Clone, Type)]
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
    async fn fetch_update(self, app_handle: AppHandle) -> Result<Option<UpdateMetadata>> {
        let url = tauri::Url::parse(&format!(
            "https://github.com/johncarmack1984/my-tauri-updater/releases/latest/download/latest.json"
        ))
            .expect("invalid URL");

        let update = app_handle
            .updater_builder()
            .endpoints(vec![url])?
            .build()?
            .check()
            .await?;

        let update_metadata = update.as_ref().map(|update| UpdateMetadata {
            version: update.version.clone(),
            current_version: update.current_version.clone(),
        });

        app_handle
            .state::<PendingUpdate>()
            .inner()
            .lock()
            .await
            .state = update;

        Ok(update_metadata)
    }

    async fn install_update(
        self,
        app_handle: AppHandle,
        on_event: Channel<DownloadEvent>,
    ) -> Result<()> {
        // pending_update: State<'_, PendingUpdate>,
        let pending_update = app_handle.state::<PendingUpdate>();

        let Some(update) = pending_update.lock().await.state.clone() else {
            return Err(Error::NoPendingUpdate);
        };
        // let Some(update) = pending_update.0.lock().unwrap().take() else {
        //     return Err(Error::NoPendingUpdate);
        // };

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
}

// // #[tauri::command]
// // #[specta::specta]
// pub async fn fetch_update(
//     app: AppHandle,
//     pending_update: State<'_, PendingUpdate>,
// ) -> Result<Option<UpdateMetadata>> {
// }

// #[tauri::command]
// // #[specta::specta]
// pub async fn install_update(
//     pending_update: State<'_, PendingUpdate>,
//     on_event: Channel<DownloadEvent>,
// ) -> Result<()> {

// }
