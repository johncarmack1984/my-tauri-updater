"use client";

import {
  createTauRPCProxy,
  type UpdateMetadata,
  type DownloadEvent,
} from "./bindings";
import { useMemo, useState } from "react";
import "./App.css";
import { relaunch } from "@tauri-apps/plugin-process";
import { getVersion } from "@tauri-apps/api/app";
import { useMutation, useQuery } from "@tanstack/react-query";

const useVersion = () => {
  return useQuery({
    queryKey: ["version"],
    queryFn: getVersion,
  });
};

function App() {
  const [fetchedUpdate, setFetchedUpdate] = useState<boolean>(false);
  const { data: version } = useVersion();
  const [update, setUpdate] = useState<UpdateMetadata | null>(null);
  const [events, setEvents] = useState<DownloadEvent[]>([]);

  const {
    mutate: checkForUpdate,
    isPending: isCheckingForUpdate,
    isError: isErrorCheckingForUpdate,
  } = useMutation({
    mutationFn: async () => {
      const update = await createTauRPCProxy().fetch_update();
      setUpdate(update);
    },
    onSuccess: () => {
      setFetchedUpdate(true);
    },
  });

  const { mutate: installUpdate, isPending: isInstallingUpdate } = useMutation({
    mutationFn: async () => {
      await createTauRPCProxy().install_update((evt) => {
        setEvents((prev) => [...prev, evt]);
      });
    },
  });

  const { mutate: relaunchApp, isPending: isRelaunchingApp } = useMutation({
    mutationFn: async () => {
      await relaunch();
    },
  });

  const started = useMemo(
    () => events.find((e) => e.event === "started"),
    [events]
  );

  const finished = useMemo(
    () => events.find((e) => e.event === "finished"),
    [events]
  );

  const updateSize = useMemo(() => {
    if (!started) return null;
    return Number(started.data.contentLength);
  }, [started]);

  const progress = useMemo(
    () =>
      events.reduce((acc: number, cur) => {
        if (cur.event === "progress") {
          return acc + Number(cur.data.chunkLength);
        }
        return acc;
      }, 0),
    [events]
  );

  const progressPercentage = useMemo(() => {
    if (!updateSize) return null;
    if (!started) return null;
    return Math.round((progress / updateSize) * 100);
  }, [started, progress, updateSize]);

  return (
    <div className="container">
      {isErrorCheckingForUpdate && <p>Error checking for update</p>}
      <h1>my-tauri-updater</h1>
      <div className="update-info">
        <div>
          current
          <h3>v{version}</h3>
        </div>

        <span>&rarr;</span>

        <div style={{ opacity: update ? 1 : 0.5 }}>
          latest
          <h3>v{update ? update?.version : "?.?.??"}</h3>
        </div>
      </div>

      {!fetchedUpdate ? (
        <div className="row events">
          <button
            type="button"
            onClick={() => checkForUpdate()}
            disabled={isCheckingForUpdate}
          >
            {isCheckingForUpdate ? (
              <>checking for update...</>
            ) : (
              <>check for update</>
            )}
          </button>
        </div>
      ) : (
        <div className="row events">
          {!update ? (
            <p>Application is up to date!</p>
          ) : (
            <>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: `${progressPercentage}%`,
                  height: "100%",
                  backgroundColor: "#111111",
                  borderRadius: "0.5rem",
                  opacity: 0.5,
                  zIndex: 0,
                }}
              />
              <div style={{ position: "relative", zIndex: 10 }}>
                {!events.length || !progressPercentage ? 0 : progressPercentage}
                %
              </div>
            </>
          )}
          {!update ? null : !finished && progressPercentage !== 100 ? (
            <button
              style={{
                position: "relative",
                zIndex: 10,
              }}
              type="button"
              onClick={() => installUpdate()}
              disabled={
                !fetchedUpdate ||
                !update ||
                !!isInstallingUpdate ||
                !!progressPercentage
              }
            >
              {isInstallingUpdate ? "installing..." : "install update?"}
            </button>
          ) : (
            <button
              type="button"
              style={{ position: "relative", zIndex: 10 }}
              onClick={() => relaunchApp()}
              disabled={isRelaunchingApp}
            >
              restart?
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
