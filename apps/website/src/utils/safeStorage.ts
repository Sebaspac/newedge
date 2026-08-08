type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

const memoryStorage = new Map<string, string>();

const createMemoryAdapter = (): StorageLike => ({
  getItem: (key: string) => memoryStorage.get(key) ?? null,
  setItem: (key: string, value: string) => {
    memoryStorage.set(key, value);
  },
  removeItem: (key: string) => {
    memoryStorage.delete(key);
  },
});

const canUseStorage = (storage: Storage | undefined) => {
  if (!storage) return false;

  try {
    const probeKey = `storage-probe-${Math.random()}`;
    storage.setItem(probeKey, probeKey);
    storage.removeItem(probeKey);
    return true;
  } catch {
    return false;
  }
};

const resolveStorage = (storage: Storage | undefined) =>
  canUseStorage(storage) ? storage : createMemoryAdapter();

export const safeLocalStorage = (): StorageLike => {
  if (typeof window === 'undefined') return createMemoryAdapter();
  return resolveStorage(window.localStorage);
};

export const safeSessionStorage = (): StorageLike => {
  if (typeof window === 'undefined') return createMemoryAdapter();
  return resolveStorage(window.sessionStorage);
};

export const safeGetItem = (storage: StorageLike, key: string) => {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};

export const safeSetItem = (storage: StorageLike, key: string, value: string) => {
  try {
    storage.setItem(key, value);
  } catch {
    memoryStorage.set(key, value);
  }
};

export const safeRemoveItem = (storage: StorageLike, key: string) => {
  try {
    storage.removeItem(key);
  } catch {
    memoryStorage.delete(key);
  }
};