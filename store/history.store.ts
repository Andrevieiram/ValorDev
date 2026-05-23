import { create } from 'zustand';

import { STORAGE_KEYS } from '@/constants';
import type { HistoryItem } from '@/types';
import { loadJson, persistJson } from './persistence';

/** Dados mock — substituir por fetch da API em features/history */
const MOCK_HISTORY: HistoryItem[] = [
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
];

const LOCAL_HISTORY_KEY = 'valordev_history_v2';

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
    const stored = await loadJson<HistoryItem[]>(LOCAL_HISTORY_KEY);
    if (stored && stored.length > 0) {
      set({ items: stored, isHydrated: true });
      return;
    }
    // Pre-populate with mock data if storage is empty
    await persistHistory(MOCK_HISTORY);
    set({ items: MOCK_HISTORY, isHydrated: true });
  },

  setItems: (items) => set({ items }),

  addItem: async (item) => {
    const newItem: HistoryItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
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
      const stored = await loadJson<HistoryItem[]>(LOCAL_HISTORY_KEY);
      set({ items: stored ?? MOCK_HISTORY });
    } finally {
      set({ isLoading: false });
    }
  },
}));

/** Persiste histórico localmente após mutações futuras */
export async function persistHistory(items: HistoryItem[]) {
  await persistJson(LOCAL_HISTORY_KEY, items);
}
