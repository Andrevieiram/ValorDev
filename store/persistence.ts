/**
 * Abstração de persistência para facilitar migração futura
 * (AsyncStorage, MMKV, backend sync, etc.)
 *
 * No web, usa localStorage. No mobile, usa SecureStore para dados sensíveis (auth) e AsyncStorage para outros.
 */
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

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

// ---------- Mobile: SecureStore (para dados sensíveis) ----------

let secureStoreAdapter: PersistenceAdapter | null = null;

async function getSecureStoreAdapter(): Promise<PersistenceAdapter> {
    if (secureStoreAdapter) return secureStoreAdapter;

    try {
        secureStoreAdapter = {
            async getItem(key) {
                return SecureStore.getItemAsync(key);
            },

            async setItem(key, value) {
                await SecureStore.setItemAsync(key, value);
            },

            async removeItem(key) {
                await SecureStore.deleteItemAsync(key);
            },
        };
    } catch (error) {
        console.warn("[persistence] SecureStore initialization failed:", error);
        secureStoreAdapter = inMemoryPersistence;
    }

    return secureStoreAdapter;
}

// ---------- Mobile: AsyncStorage ----------

let asyncStorageAdapter: PersistenceAdapter | null = null;

async function getAsyncStorageAdapter(): Promise<PersistenceAdapter> {
    if (asyncStorageAdapter) return asyncStorageAdapter;

    try {
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
    } catch (error) {
        console.warn("[persistence] AsyncStorage initialization failed:", error);

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

    if (Platform.OS === "web") {
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

// ---------- Operações sensíveis (autenticação, etc.) ----------

export async function persistSensitiveJson<T>(key: string, value: T): Promise<void> {
    if (Platform.OS === "web") {
        // Web: usa localStorage (menos seguro, mas sem opção melhor)
        await persistJson(key, value);
    } else {
        // Mobile: usa SecureStore
        const adapter = await getSecureStoreAdapter();
        await adapter.setItem(key, JSON.stringify(value));
    }
}

export async function loadSensitiveJson<T>(key: string): Promise<T | null> {
    if (Platform.OS === "web") {
        // Web: usa localStorage
        return loadJson<T>(key);
    } else {
        // Mobile: usa SecureStore
        const adapter = await getSecureStoreAdapter();
        const raw = await adapter.getItem(key);
        if (!raw) return null;
        try {
            return JSON.parse(raw) as T;
        } catch {
            return null;
        }
    }
}

export async function removeSensitivePersisted(key: string): Promise<void> {
    if (Platform.OS === "web") {
        // Web: usa localStorage
        await removePersisted(key);
    } else {
        // Mobile: usa SecureStore
        const adapter = await getSecureStoreAdapter();
        await adapter.removeItem(key);
    }
}

export { inMemoryPersistence };
