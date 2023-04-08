import { createStore, StateCreator, create } from "zustand";
import { createJSONStorage, persist, PersistStorage } from "zustand/middleware";

const persistStorage = persist as unknown as Function;

export const storageBase64 = (storage: any = localStorage) => {
  return {
    getItem: (key) => {
      const retorno = atob(storage.getItem(key));
      return retorno;
    },
    setItem: (key, value) => {
      storage.setItem(key, btoa(value));
    },
    removeItem: storage.removeItem,
  } as Storage;
};

type TStoreFactoryConfig = {
  name: string;
  storage?: PersistStorage<Storage>;
  base64?: boolean;
};

type TStore<T> = {
  getState: () => Readonly<T>;
  setState: (state: Partial<T>) => void;
  subscribe: (listener: (state: T, prevState: T) => void) => () => void;
};

/**
 * Create new zustand store
 * 
 * @param callback 
 * @param config 
 * @returns 
 */
export function storeFactory<T extends {}>(
  callback: StateCreator<T>,
  config?: TStoreFactoryConfig
) {
  let callbackCreator = callback;
  if (config?.name) {
    callbackCreator = persistStorage(callback, {
      name: config?.name,
      storage: createJSONStorage(() => {
        let storage = localStorage as unknown as PersistStorage<Storage>;
        if (config?.base64) {
          storage = storageBase64(
            config?.storage
          ) as unknown as PersistStorage<Storage>;
        } else if (config?.storage && !config?.base64) {
          storage = config?.storage;
        }

        return storage as any;
      }),
    });
  }
  return createStore<T>(callbackCreator) as TStore<T>;
}

export function useStoreReact<T extends {}>(store) {
  return create<T>(store);
}
