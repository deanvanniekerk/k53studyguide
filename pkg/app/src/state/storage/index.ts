/** Non-persisted health signal: saving a failure flag must not require storage. */
let unavailable = false;
const listeners = new Set<() => void>();
export const storageUnavailable = () => unavailable;
export const subscribeStorageStatus = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
export const reportStorageUnavailable = () => {
  if (unavailable) return;
  unavailable = true;
  for (const listener of listeners) listener();
};
export const probeBrowserStorage = () => {
  try {
    const key = "k53:storage-probe";
    window.localStorage.setItem(key, "1");
    window.localStorage.removeItem(key);
  } catch {
    reportStorageUnavailable();
  }
};
