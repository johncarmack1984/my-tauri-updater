"use client";

import { createTauRPCProxy } from "./bindings";
import { useState } from "react";
import "./App.css";
import { useQuery } from "@tanstack/react-query";
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

  const { data: taurpc } = useQuery({
    queryKey: ["taurpc"],
    queryFn: createTauRPCProxy,
  });

  const [fetchedUpdate, setFetchedUpdate] = useState<boolean>(false);
  const [installingUpdate, setInstallingUpdate] = useState<unknown>(null);
  const [update, setUpdate] = useState<unknown>(null);

  const checkForUpdate = async () => {
    try {
      setFetchedUpdate(true);
      // const update = await invoke("fetch_update");
      const update = await taurpc?.fetch_update();
      console.log(update);
      setUpdate(update);
    } catch (error) {
      console.error(error);
      setUpdate(error);
    }
  };

  const installUpdate = async (_evt: React.MouseEvent<HTMLButtonElement>) => {
    // setInstallingUpdate(await invoke("install_update"));
    setInstallingUpdate(await taurpc?.install_update(null));
  };

  return (
    <div className="container">
      <h1>my-tauri-updater</h1>
      <div className="row">
        <button type="button" onClick={checkForUpdate}>
          check for update
        </button>
        <button type="button" onClick={installUpdate}>
          install update
        </button>
      </div>
      <div className="row">
        <div>Fetched ?{fetchedUpdate ? <>✅</> : <></>}</div>
      </div>
      <div className="row">
        {update ? (
          <pre>{JSON.stringify(update, null, 2)}</pre>
        ) : (
          <p>update null</p>
        )}
      </div>
      <div className="row">
        <div>Installing update var: {JSON.stringify(installingUpdate)}</div>
      </div>
    </div>
  );
}

export default App;
