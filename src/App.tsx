import { useEffect, useState } from "react";
import "./App.css";
// import { check } from "@tauri-apps/plugin-updater";
// import { relaunch } from "@tauri-apps/plugin-process";
import { invoke } from "@tauri-apps/api/core";

function App() {
  useEffect(() => {
    // const checkUpdate = async () => {
    //   const update = await check();
    //   if (update) {
    //     console.log(
    //       `found update ${update.version} from ${update.date} with notes ${update.body}`
    //     );
    //     let downloaded = 0;
    //     let contentLength = 0;
    //     // alternatively we could also call update.download() and update.install() separately
    //     await update.downloadAndInstall((event) => {
    //       switch (event.event) {
    //         case "Started":
    //           contentLength = event.data.contentLength ?? 0;
    //           console.log(
    //             `started downloading ${event.data.contentLength} bytes`
    //           );
    //           break;
    //         case "Progress":
    //           downloaded += event.data.chunkLength;
    //           console.log(`downloaded ${downloaded} from ${contentLength}`);
    //           break;
    //         case "Finished":
    //           console.log("download finished");
    //           break;
    //       }
    //     });
    //     console.log("update installed");
    //     await relaunch();
    //   }
    // };
    // checkUpdate();
  }, []);

  const [update, setUpdate] = useState<unknown>(null);

  const checkForUpdate = async () => {
    try {
      const update = await invoke("fetch_update");
      console.log(update);
      setUpdate(update);
    } catch (error) {
      console.error(error);
      setUpdate(error);
    }
  };

  const installUpdate = async () => {
    try {
      const update = await invoke("install_update");
      console.log(update);
      setUpdate(update);
    } catch (error) {
      console.error(error);
      setUpdate(error);
    }
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
        {update ? <pre>{JSON.stringify(update, null, 2)}</pre> : null}
      </div>
    </div>
  );
}

export default App;
