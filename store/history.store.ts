import { create } from 'zustand';
import { nanoid } from 'nanoid';

import { STORAGE_KEYS, STORAGE_VERSION } from '@/constants';
import type { HistoryItem } from '@/types';
import { loadJson, persistJson } from './persistence';
import { proposalsApi } from '@/api/proposals.api';
import type { ProposalDto } from '@/api/types';

/** Converte um ProposalDto da API para o formato HistoryItem usado na UI */
function proposalDtoToHistoryItem(dto: ProposalDto): HistoryItem {
  return {
    id: dto.id,
    name: dto.name,
    value: dto.recommendedPrice,
    date: dto.createdAt,
    status: dto.status as HistoryItem['status'],
    createdAt: dto.createdAt,
    probability: dto.probability as HistoryItem['probability'],
  };
}

interface HistoryState {
  items: HistoryItem[];
  isLoading: boolean;
  isHydrated: boolean;

  hydrate: () => Promise<void>;
  setItems: (items: HistoryItem[]) => void;
  addItem: (item: Omit<HistoryItem, 'id' | 'createdAt'>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateItemProbability: (id: string, probability: import('@/types').Probability) => Promise<void>;
  /** Busca o histórico de propostas da API do backend */
  fetchFromApi: () => Promise<void>;
  /** @deprecated Use fetchFromApi para dados reais */
  fetchHistory: () => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  items: [],
  isLoading: false,
  isHydrated: false,

  hydrate: async () => {
    // Hidratação inicial: carrega do localStorage enquanto busca da API
    const stored = await loadJson<HistoryItem[] | HistoryPayload>(STORAGE_KEYS.history);

    let items: HistoryItem[] = [];
    if (stored) {
      if (Array.isArray(stored)) {
        items = stored;
      } else if ('items' in stored && Array.isArray(stored.items)) {
        items = stored.items;
      }
    }

    // Seta o que tiver no cache local primeiro (evita tela vazia)
    set({ items, isHydrated: true });

    // Então busca da API para ter dados frescos
    await get().fetchFromApi();
  },

  setItems: (items) => set({ items }),

  fetchFromApi: async () => {
    set({ isLoading: true });
    try {
      const dtos = await proposalsApi.list();
      const items = dtos.map(proposalDtoToHistoryItem);
      set({ items });
      // Atualiza cache local com dados reais
      await persistHistory(items);
    } catch (err) {
      // Silencia erro de rede — mantém o cache local exibido
      console.warn('[HistoryStore] Falha ao buscar propostas da API:', err);
    } finally {
      set({ isLoading: false });
    }
  },

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
    // Remove na API primeiro, depois atualiza o estado local
    try {
      await proposalsApi.delete(id);
    } catch (err) {
      console.warn('[HistoryStore] Falha ao deletar proposta na API:', err);
    }
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
    return get().fetchFromApi();
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
