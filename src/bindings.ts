// My header
/**
 * Updater configuration.
 */
export type Config = { 
/**
 * Dangerously allow using insecure transport protocols for update endpoints.
 */
dangerous_insecure_transport_protocol: boolean; 
/**
 * Updater endpoints.
 */
endpoints: string[]; 
/**
 * Signature public key.
 */
pubkey: string; 
/**
 * The Windows configuration for the updater.
 */
windows: WindowsConfig | null }

export type DownloadEvent = { event: "Started"; data: { contentLength: string | null } } | { event: "Progress"; data: { chunkLength: string } } | { event: "Finished" }

export type Duration = { secs: string; nanos: number }

export type PendingUpdateState = { state: Update | null }

/**
 * Permission state.
 */
export type PermissionState = 
/**
 * Permission access has been granted.
 */
"Granted" | 
/**
 * Permission access has been denied.
 */
"Denied" | 
/**
 * Permission must be requested.
 */
"Prompt" | 
/**
 * Permission must be requested, but you must explain to the user why your app needs that permission. **Android only**.
 */
"PromptWithRationale"

export type TAURI_CHANNEL<TSend> = null

export type TauRpcUpdatableInputTypes = { proc_name: "fetch_update"; input_type: null } | { proc_name: "install_update"; input_type: { __taurpc_type: TAURI_CHANNEL<DownloadEvent> } }

export type TauRpcUpdatableOutputTypes = { proc_name: "fetch_update"; output_type: UpdateMetadata | null } | { proc_name: "install_update"; output_type: null }

export type Update = { config: Config; on_before_exit: null | null; 
/**
 * Update description
 */
body: string | null; 
/**
 * Version used to check for update
 */
current_version: string; 
/**
 * Version announced
 */
version: string; 
/**
 * Update publish date
 */
date: string | null; 
/**
 * Target
 */
target: string; 
/**
 * Download URL announced
 */
download_url: string; 
/**
 * Signature announced
 */
signature: string; 
/**
 * Request timeout
 */
timeout: Duration | null; 
/**
 * Request proxy
 */
proxy: string | null; 
/**
 * Request headers
 */
headers: { [key in string]: string }; 
/**
 * Extract path
 */
extract_path: string; 
/**
 * App name, used for creating named tempfiles on Windows
 */
app_name: string; installer_args: string[]; current_exe_args: string[] }

export type UpdateMetadata = { version: string; currentVersion: string }

export type UpdaterBuilder = { app_name: string; current_version: string; config: Config; version_comparator: null | null; executable_path: string | null; target: string | null; endpoints: string[]; headers: { [key in string]: string }; timeout: Duration | null; proxy: string[]; installer_args: string[]; current_exe_args: string[]; on_before_exit: null | null }

export type WindowsConfig = { 
/**
 * Additional arguments given to the NSIS or WiX installer.
 */
installerArgs?: string[]; 
/**
 * Updating mode, defaults to `passive` mode.
 * 
 * See [`WindowsUpdateInstallMode`] for more info.
 */
installMode?: WindowsUpdateInstallMode }

/**
 * Install modes for the Windows update.
 */
export type WindowsUpdateInstallMode = 
/**
 * Specifies there's a basic UI during the installation process, including a final dialog box at the end.
 */
"basicUi" | 
/**
 * The quiet mode means there's no user interaction required.
 * Requires admin privileges if the installer does.
 */
"quiet" | 
/**
 * Specifies unattended mode, which means the installation only shows a progress bar.
 */
"passive"

const ARGS_MAP = {'':'{"install_update":["on_event"],"fetch_update":[]}'}
import { createTauRPCProxy as createProxy } from "taurpc"

export const createTauRPCProxy = () => createProxy<Router>(ARGS_MAP)

type Router = {
	'': [TauRpcUpdatableInputTypes, TauRpcUpdatableOutputTypes],
}