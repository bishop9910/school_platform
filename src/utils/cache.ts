// utils/cache.ts

export interface CacheStorage {
  set(key: string, value: string): void;
  get(key: string): string | null;
  setJSON<T>(key: string, value: T): void;
  getJSON<T>(key: string): T | null;
  remove(key: string): void;
  clear(): void;
}

const isBrowser = typeof window !== 'undefined';

function createCache(storage: Storage | null): CacheStorage {
  return {
    set(key: string, value: string): void {
      if (!isBrowser || !storage) return;
      if (key != null && value != null) {
        storage.setItem(key, value);
      }
    },

    get(key: string): string | null {
      if (!isBrowser || !storage) return null;
      if (key == null) return null;
      return storage.getItem(key);
    },

    setJSON<T>(key: string, jsonValue: T): void {
      if (jsonValue != null) {
        this.set(key, JSON.stringify(jsonValue));
      }
    },

    getJSON<T>(key: string): T | null {
      const value = this.get(key);
      if (value != null) {
        try {
          return JSON.parse(value) as T;
        } catch (e) {
          console.error(`Failed to parse JSON for key "${key}":`, e);
          return null;
        }
      }
      return null;
    },

    remove(key: string): void {
      if (!isBrowser || !storage) return;
      storage.removeItem(key);
    },

    clear(): void {
      if (!isBrowser || !storage) return;
      storage.clear();
    }
  };
}

const emptyCache: CacheStorage = {
  set: () => {},
  get: () => null,
  setJSON: () => {},
  getJSON: () => null,
  remove: () => {},
  clear: () => {}
};

const sessionCache: CacheStorage = isBrowser ? createCache(sessionStorage) : emptyCache;
const localCache: CacheStorage = isBrowser ? createCache(localStorage) : emptyCache;

export interface CacheManager {
  session: CacheStorage;
  local: CacheStorage;
}

if (isBrowser) {
  window.addEventListener('beforeunload', () => {
    sessionCache.remove('tempData');
  });
}

const cache: CacheManager = {
  /**
   * 会话级缓存（页面关闭后清除）
   * 存在tempData里面
   */
  session: sessionCache,
  /**
   * 本地缓存（持久化存储）
   * localStorage
   */
  local: localCache
};

export default cache;