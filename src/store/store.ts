import { Preferences } from '@capacitor/preferences';

const createStorage = () => {
  return {
    getItem: (key: string): Promise<string | null> => {
      return new Promise((resolve) => {
        (async () => {
          const { value } = await Preferences.get({ key: key });
          resolve(value);
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
