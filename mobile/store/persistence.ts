/**
 * Abstração de persistência para facilitar migração futura
 * (AsyncStorage, MMKV, backend sync, etc.)
 */
export interface PersistenceAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

const memoryStore = new Map<string, string>();

/** Implementação em memória — substituir por AsyncStorage na fase de persistência */
export const inMemoryPersistence: PersistenceAdapter = {
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

let activeAdapter: PersistenceAdapter = inMemoryPersistence;

export function setPersistenceAdapter(adapter: PersistenceAdapter) {
  activeAdapter = adapter;
}

export function getPersistenceAdapter(): PersistenceAdapter {
  return activeAdapter;
}

export async function persistJson<T>(key: string, value: T): Promise<void> {
  await activeAdapter.setItem(key, JSON.stringify(value));
}

export async function loadJson<T>(key: string): Promise<T | null> {
  const raw = await activeAdapter.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function removePersisted(key: string): Promise<void> {
  await activeAdapter.removeItem(key);
}
