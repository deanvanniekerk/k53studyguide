import { App } from "@capacitor/app";
import type { PluginListenerHandle } from "@capacitor/core";
import { Network } from "@capacitor/network";
import { useEffect } from "react";
import { useStore } from "react-redux";
import type { PurchaseService } from "@/services";
import type { RootState } from "@/state";

/** One recovery listener for the app, including while Ionic pages are cached. */
export function usePurchaseRecovery(service: PurchaseService | null) {
  const store = useStore<RootState>();

  useEffect(() => {
    if (!service) return;
    let disposed = false;
    let recovering = false;
    let recoveryRequested = false;
    const listeners: PluginListenerHandle[] = [];
    const canRecover = () => {
      const purchase = store.getState().purchase;
      return !disposed && !purchase.owned && purchase.orderState !== "pending" && !purchase.paymentPending;
    };
    const recover = async () => {
      if (!canRecover()) return;
      recoveryRequested = true;
      if (recovering) return;
      recovering = true;
      try {
        do {
          recoveryRequested = false;
          // A connection can return before the original offline request rejects.
          // Wait for that attempt, then retry if it still left the store unavailable.
          if (store.getState().purchase.availability === "loading") await service.initialize();
          if (canRecover() && store.getState().purchase.availability === "unavailable") {
            await service.initialize(true);
          }
          // Coalesce new recovery signals during a request; never poll or overlap loads.
        } while (recoveryRequested && canRecover());
      } finally {
        recovering = false;
      }
    };
    const retry = () => {
      void recover().catch(() => console.warn("Unable to refresh store availability."));
    };
    const register = (listener: Promise<PluginListenerHandle>) => {
      void listener
        .then(async (handle) => {
          if (disposed) await handle.remove();
          else listeners.push(handle);
        })
        .catch(() => console.warn("Unable to listen for store recovery. Manual retry remains available."));
    };

    register(Network.addListener("networkStatusChange", ({ connected }) => connected && retry()));
    register(App.addListener("appStateChange", ({ isActive }) => isActive && retry()));
    return () => {
      disposed = true;
      for (const listener of listeners) void listener.remove().catch(() => {});
    };
  }, [service, store]);
}
