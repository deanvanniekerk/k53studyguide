import { Preferences } from "@capacitor/preferences";

type StorageOptions = {
  legacyKey?: string;
};

const createStorage = (options: StorageOptions = {}) => {
  return {
    getItem: (key: string): Promise<string | null> => {
      return new Promise((resolve) => {
        (async () => {
          const { value } = await Preferences.get({ key: key });
          if (value || !options.legacyKey) {
            resolve(value);
            return;
          }

          const legacy = await Preferences.get({ key: options.legacyKey });
          resolve(legacy.value);
        })();
      });
    },
    setItem: (key: string, item: string): Promise<void> => {
      return new Promise((resolve) => {
        (async () => {
          await Preferences.set({ key: key, value: item });
          resolve();
        })();
      });
    },
    removeItem: (key: string): Promise<void> => {
      return new Promise((resolve) => {
        (async () => {
          await Preferences.remove({ key: key });
          resolve();
        })();
      });
    },
  };
};

export { createStorage };
