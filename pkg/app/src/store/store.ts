import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { reportStorageUnavailable } from "@/state/storage";

const unreadKeys = new Set<string>();

type StorageOptions = { legacyKey?: string };

/** Preferences remains the persistence adapter on every platform. */
const createStorage = (options: StorageOptions = {}) => {
  const recover = (error: unknown) => {
    if (Capacitor.getPlatform() !== "web") throw error;
    reportStorageUnavailable();
  };
  return {
    getItem: async (key: string): Promise<string | null> => {
      try {
        const current = await Preferences.get({ key });
        const value =
          current.value || !options.legacyKey
            ? current.value
            : (await Preferences.get({ key: options.legacyKey })).value;
        unreadKeys.delete(key);
        return value;
      } catch (error) {
        recover(error);
        // Unknown is not empty: defaults must never overwrite a record we couldn't read.
        unreadKeys.add(key);
        return null;
      }
    },
    setItem: async (key: string, value: string): Promise<void> => {
      if (unreadKeys.has(key)) return;
      try {
        await Preferences.set({ key, value });
      } catch (error) {
        recover(error);
      }
    },
    removeItem: async (key: string): Promise<void> => {
      try {
        await Preferences.remove({ key });
      } catch (error) {
        recover(error);
      }
    },
  };
};

export { createStorage };
