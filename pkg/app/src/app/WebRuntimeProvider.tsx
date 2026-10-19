import type { PluginListenerHandle } from "@capacitor/core";
import { Network } from "@capacitor/network";
import { Translate } from "@k53studyguide/shared/translation";
import { Component, createContext, type ReactNode, useContext, useEffect, useState, useSyncExternalStore } from "react";
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
    const chunkError = () => {
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
      <WebChunkBoundary chunkFailed={chunkFailed}>{children}</WebChunkBoundary>
    </WebRuntimeContext.Provider>
  );
}

function ChunkRecovery() {
  return (
    <main role="alert" style={{ padding: "15vh 24px", maxWidth: 640, margin: "auto", lineHeight: 1.6 }}>
      <p>
        <Translate text="webChunkFailed" />
      </p>
      <button type="button" onClick={() => window.location.reload()}>
        <Translate text="webReload" />
      </button>
    </main>
  );
}

/** Keep a failed route's recovery outside the page that could not load. */
class WebChunkBoundary extends Component<{ children: ReactNode; chunkFailed: boolean }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      if (this.props.chunkFailed) return <ChunkRecovery />;
      throw this.state.error;
    }
    return this.props.children;
  }
}
