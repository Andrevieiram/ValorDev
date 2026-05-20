/**
 * Abstração de persistência para facilitar migração futura
 * (AsyncStorage, MMKV, backend sync, etc.)
 *
 * No web, usa localStorage. No mobile, usa AsyncStorage.
 */
import { Platform } from 'react-native';

export interface PersistenceAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

// ---------- Web: localStorage ----------
const webPersistence: PersistenceAdapter = {
  async getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  async setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // quota exceeded — fail silently
    }
  },
  async removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch {
      // fail silently
    }
  },
};

// ---------- Mobile: AsyncStorage ----------
let asyncStorageAdapter: PersistenceAdapter | null = null;

async function getAsyncStorageAdapter(): Promise<PersistenceAdapter> {
  if (asyncStorageAdapter) return asyncStorageAdapter;

  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    asyncStorageAdapter = {
      async getItem(key) {
        return AsyncStorage.getItem(key);
      },
      async setItem(key, value) {
        await AsyncStorage.setItem(key, value);
      },
      async removeItem(key) {
        await AsyncStorage.removeItem(key);
      },
    };
  } catch {
    // Fallback para memória se AsyncStorage não estiver instalado
    console.warn('[persistence] AsyncStorage not available, falling back to in-memory storage');
    asyncStorageAdapter = inMemoryPersistence;
  }

  return asyncStorageAdapter;
}

// ---------- Fallback: memória ----------
const memoryStore = new Map<string, string>();

const inMemoryPersistence: PersistenceAdapter = {
  async getItem(key) {
    return memoryStore.get(key) ?? null;
  },
  async setItem(key, value) {
    memoryStore.set(key, value);
  },
  async removeItem(key) {
    memoryStore.delete(key);
  },
};

// ---------- Adapter ativo ----------
let activeAdapter: PersistenceAdapter | null = null;

async function resolveAdapter(): Promise<PersistenceAdapter> {
  if (activeAdapter) return activeAdapter;

  if (Platform.OS === 'web') {
    activeAdapter = webPersistence;
  } else {
    activeAdapter = await getAsyncStorageAdapter();
  }

  return activeAdapter;
}

export function setPersistenceAdapter(adapter: PersistenceAdapter) {
  activeAdapter = adapter;
}

export function getPersistenceAdapter(): PersistenceAdapter {
  // Retorna web/memory sincronamente se já foi resolvido
  return activeAdapter ?? webPersistence;
}

export async function persistJson<T>(key: string, value: T): Promise<void> {
  const adapter = await resolveAdapter();
  await adapter.setItem(key, JSON.stringify(value));
}

export async function loadJson<T>(key: string): Promise<T | null> {
  const adapter = await resolveAdapter();
  const raw = await adapter.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function removePersisted(key: string): Promise<void> {
  const adapter = await resolveAdapter();
  await adapter.removeItem(key);
}

export { inMemoryPersistence };
