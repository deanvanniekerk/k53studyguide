import type { PluginListenerHandle } from "@capacitor/core";
import { Network } from "@capacitor/network";
import { createContext, type ReactNode, useContext, useEffect, useState, useSyncExternalStore } from "react";
import { useSelector } from "react-redux";
import { accessModelSelector } from "@/state/access";
import { probeBrowserStorage, storageUnavailable, subscribeStorageStatus } from "@/state/storage";

const WebRuntimeContext = createContext({
  connected: true,
  isWeb: false,
  storageUnavailable: false,
  chunkFailed: false,
});
export const useWebRuntime = () => useContext(WebRuntimeContext);

/** One connection listener for all browser banners and retryable images. */
export function WebRuntimeProvider({ children }: { children: ReactNode }) {
  const isWeb = useSelector(accessModelSelector) === "free_web";
  const cannotSave = useSyncExternalStore(subscribeStorageStatus, storageUnavailable, () => false);
  const [chunkFailed, setChunkFailed] = useState(false);
  const [connected, setConnected] = useState(true);
  useEffect(() => {
    if (!isWeb) return;
    probeBrowserStorage();
    const chunkError = (event: Event) => {
      event.preventDefault();
      setChunkFailed(true);
    };
    window.addEventListener("vite:preloadError", chunkError);
    let disposed = false;
    let receivedEvent = false;
    let handle: PluginListenerHandle | undefined;
    const update = ({ connected }: { connected: boolean }) => {
      if (disposed) return;
      setConnected(connected);
    };
    void Network.addListener("networkStatusChange", (status) => {
      receivedEvent = true;
      update(status);
    })
      .then(async (listener) => {
        if (disposed) await listener.remove();
        else handle = listener;
      })
      .catch(() => console.warn("Unable to monitor the connection."));
    void Network.getStatus()
      .then((status) => {
        if (!receivedEvent) update(status);
      })
      .catch(() => {});
    return () => {
      window.removeEventListener("vite:preloadError", chunkError);
      disposed = true;
      void handle?.remove();
    };
  }, [isWeb]);
  return (
    <WebRuntimeContext.Provider value={{ connected, isWeb, storageUnavailable: cannotSave, chunkFailed }}>
      {children}
    </WebRuntimeContext.Provider>
  );
}
