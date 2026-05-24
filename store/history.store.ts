import { create } from 'zustand';
import { nanoid } from 'nanoid';

import { STORAGE_KEYS, STORAGE_VERSION } from '@/constants';
import type { HistoryItem } from '@/types';
import { loadJson, persistJson } from './persistence';

/** Dados mock — apenas carregados em __DEV__ ou quando storage está vazio */
const MOCK_HISTORY: HistoryItem[] = __DEV__ ? [
  {
    id: '1',
    name: 'E-commerce App',
    value: 15000,
    date: '',
    status: 'sent',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    probability: 'alta',
  },
  {
    id: '2',
    name: 'Site Institucional',
    value: 4500,
    date: '',
    status: 'sent',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    probability: 'fechada',
  },
  {
    id: '3',
    name: 'Automação de Processos',
    value: 8000,
    date: '',
    status: 'sent',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    probability: 'media',
  },
  {
    id: '4',
    name: 'MVP SaaS',
    value: 22000,
    date: '',
    status: 'sent',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    probability: 'alta',
  },
  {
    id: '5',
    name: 'Consultoria UI/UX',
    value: 2000,
    date: '',
    status: 'sent',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    probability: 'baixa',
  },
  {
    id: '6',
    name: 'Aplicativo de Delivery',
    value: 12500,
    date: '',
    status: 'sent',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    probability: 'fechada',
  },
] : [];

interface HistoryState {
  items: HistoryItem[];
  isLoading: boolean;
  isHydrated: boolean;

  hydrate: () => Promise<void>;
  setItems: (items: HistoryItem[]) => void;
  addItem: (item: Omit<HistoryItem, 'id' | 'createdAt'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateItemProbability: (id: string, probability: import('@/types').Probability) => Promise<void>;
  /** Ponto de integração futuro com backend */
  fetchHistory: () => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  items: MOCK_HISTORY,
  isLoading: false,
  isHydrated: false,

  hydrate: async () => {
    const stored = await loadJson<HistoryItem[] | HistoryPayload>(STORAGE_KEYS.history);

    // Suportar ambos formatos: array antigo e novo com versionamento
    let items: HistoryItem[] = [];
    if (stored) {
      if (Array.isArray(stored)) {
        items = stored;
      } else if ('items' in stored && Array.isArray(stored.items)) {
        items = stored.items;
      }
    }

    if (items.length > 0) {
      set({ items, isHydrated: true });
      return;
    }
    // Pre-populate with mock data only if in development and storage is empty
    if (MOCK_HISTORY.length > 0) {
      await persistHistory(MOCK_HISTORY);
      set({ items: MOCK_HISTORY, isHydrated: true });
    } else {
      set({ items: [], isHydrated: true });
    }
  },

  setItems: (items) => set({ items }),

  addItem: async (item) => {
    const newItem: HistoryItem = {
      ...item,
      id: nanoid(9),
      createdAt: new Date().toISOString(),
      probability: item.probability || 'media',
    };
    const updated = [newItem, ...get().items];
    set({ items: updated });
    await persistHistory(updated);
  },

  removeItem: async (id) => {
    const updated = get().items.filter((item) => item.id !== id);
    set({ items: updated });
    await persistHistory(updated);
  },

  updateItemProbability: async (id, probability) => {
    const updated = get().items.map((item) =>
      item.id === id ? { ...item, probability } : item
    );
    set({ items: updated });
    await persistHistory(updated);
  },

  fetchHistory: async () => {
    set({ isLoading: true });
    try {
      const stored = await loadJson<HistoryItem[] | HistoryPayload>(STORAGE_KEYS.history);

      let items: HistoryItem[] = [];
      if (stored) {
        if (Array.isArray(stored)) {
          items = stored;
        } else if ('items' in stored && Array.isArray(stored.items)) {
          items = stored.items;
        }
      }

      set({ items });
    } finally {
      set({ isLoading: false });
    }
  },
}));

interface HistoryPayload {
  version: number;
  items: HistoryItem[];
}

/** Persiste histórico localmente com versionamento */
export async function persistHistory(items: HistoryItem[]) {
  const payload: HistoryPayload = {
    version: STORAGE_VERSION,
    items,
  };
  await persistJson(STORAGE_KEYS.history, payload);
}
