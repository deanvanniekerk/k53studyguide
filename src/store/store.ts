import { Storage } from '@capacitor/storage';

const createStorage = () => {
  return {
    getItem: (key: string): Promise<string | null> => {
      return new Promise((resolve) => {
        (async () => {
          const { value } = await Storage.get({ key: key });
          resolve(value);
        })();
      });
    },
    setItem: (key: string, item: string): Promise<void> => {
      return new Promise((resolve) => {
        (async () => {
          await Storage.set({ key: key, value: item });
          resolve();
        })();
      });
    },
    removeItem: (key: string): Promise<void> => {
      return new Promise((resolve) => {
        (async () => {
          await Storage.remove({ key: key });
          resolve();
        })();
      });
    },
  };
};

export { createStorage };
