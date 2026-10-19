import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { reportStorageUnavailable } from "@/state/storage";

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
        const { value } = await Preferences.get({ key });
        if (value || !options.legacyKey) return value;
        return (await Preferences.get({ key: options.legacyKey })).value;
      } catch (error) {
        recover(error);
        return null;
      }
    },
    setItem: async (key: string, value: string): Promise<void> => {
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
