"use client";

import { createTauRPCProxy, type DownloadEvent } from "./bindings";
import { useState } from "react";
import "./App.css";
// import { check } from "@tauri-apps/plugin-updater";
// import { relaunch } from "@tauri-apps/plugin-process";

function App() {
  // useEffect(() => {
  //   const checkUpdate = async () => {
  //     const update = await check();
  //     if (update) {
  //       console.log(
  //         `found update ${update.version} from ${update.date} with notes ${update.body}`
  //       );
  //       let downloaded = 0;
  //       let contentLength = 0;
  //       // alternatively we could also call update.download() and update.install() separately
  //       await update.downloadAndInstall((event) => {
  //         switch (event.event) {
  //           case "Started":
  //             contentLength = event.data.contentLength ?? 0;
  //             console.log(
  //               `started downloading ${event.data.contentLength} bytes`
  //             );
  //             break;
  //           case "Progress":
  //             downloaded += event.data.chunkLength;
  //             console.log(`downloaded ${downloaded} from ${contentLength}`);
  //             break;
  //           case "Finished":
  //             console.log("download finished");
  //             break;
  //         }
  //       });
  //       console.log("update installed");
  //       await relaunch();
  //     }
  //   };
  //   checkUpdate();
  // }, []);

  const [fetchedUpdate, setFetchedUpdate] = useState<boolean>(false);
  const [installingUpdate, setInstallingUpdate] = useState<unknown>(null);
  const [update, setUpdate] = useState<unknown>(null);
  const [events, setEvents] = useState<DownloadEvent[]>([]);

  const checkForUpdate = async () => {
    try {
      setFetchedUpdate(true);
      const update = await createTauRPCProxy().fetch_update();
      setUpdate(update);
    } catch (error) {
      setUpdate(error);
    }
  };

  const installUpdate = async (_evt: React.MouseEvent<HTMLButtonElement>) => {
    setInstallingUpdate(true);
    await createTauRPCProxy()
      .install_update((evt) => {
        setEvents((prev) => [...prev, evt]);
      })
      .finally(() => {
        setInstallingUpdate(false);
      });
  };

  return (
    <div className="container">
      <h1>my-tauri-updater</h1>
      <div className="buttons row">
        <button type="button" onClick={checkForUpdate}>
          check for update
        </button>
        <button
          type="button"
          onClick={installUpdate}
          disabled={!fetchedUpdate || !update || !!installingUpdate}
        >
          {installingUpdate ? "installing..." : "install update"}
        </button>
      </div>
      <div className="row">
        <div>Fetched? {fetchedUpdate ? <>Yes</> : <>No</>}</div>
      </div>
      {!fetchedUpdate ? null : (
        <>
          <div className="row">
            {update ? (
              <pre>{JSON.stringify(update, null, 2)}</pre>
            ) : (
              <p>No update found!</p>
            )}
          </div>
          {!installingUpdate ? null : (
            <div className="row">
              Installing update: {JSON.stringify(installingUpdate)}
            </div>
          )}
          {!events.length ? null : (
            <div className="row events">
              {events.map((evt) => (
                <pre key={evt.event}>{JSON.stringify(evt, null, 2)}</pre>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
