import { create } from "zustand";
import { STORAGE_KEYS } from "@/constants";
import { loadJson, persistJson } from "./persistence";

interface SettingsState {
  theme: "light" | "dark";
  currency: "BRL" | "USD" | "EUR";
  language: "pt" | "en";
  isHydrated: boolean;

  setTheme: (theme: "light" | "dark") => Promise<void>;
  setCurrency: (currency: "BRL" | "USD" | "EUR") => Promise<void>;
  setLanguage: (language: "pt" | "en") => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  theme: "light",
  currency: "BRL",
  language: "pt",
  isHydrated: false,

  setTheme: async (theme) => {
    set({ theme });
    await persistJson(STORAGE_KEYS.settings, {
      theme,
      currency: get().currency,
      language: get().language,
    });
  },

  setCurrency: async (currency) => {
    set({ currency });
    await persistJson(STORAGE_KEYS.settings, {
      theme: get().theme,
      currency,
      language: get().language,
    });
  },

  setLanguage: async (language) => {
    set({ language });
    await persistJson(STORAGE_KEYS.settings, {
      theme: get().theme,
      currency: get().currency,
      language,
    });
  },

  hydrate: async () => {
    const stored = await loadJson<{
      theme?: "light" | "dark";
      currency?: "BRL" | "USD" | "EUR";
      language?: "pt" | "en";
    }>(STORAGE_KEYS.settings);

    if (stored) {
      set({
        theme: stored.theme ?? "light",
        currency: stored.currency ?? "BRL",
        language: stored.language ?? "pt",
        isHydrated: true,
      });
    } else {
      set({ isHydrated: true });
    }
  },
}));
