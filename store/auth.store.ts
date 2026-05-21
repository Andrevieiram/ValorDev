import { create } from "zustand";
import { loadJson, persistJson, removePersisted } from "./persistence";

interface User {
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  skipped: boolean;
  isHydrated: boolean;

  login: (email: string, name?: string) => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  skipAuth: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  skipped: false,
  isHydrated: false,

  login: async (email, name = "Desenvolvedor") => {
    const user = { name, email };
    set({ user, skipped: false });
    await persistJson("@pricing-pro/auth-session", { user, skipped: false });
  },

  register: async (name, email) => {
    const user = { name, email };
    set({ user, skipped: false });
    await persistJson("@pricing-pro/auth-session", { user, skipped: false });
  },

  logout: async () => {
    set({ user: null, skipped: false });
    await removePersisted("@pricing-pro/auth-session");
  },

  skipAuth: async () => {
    set({ user: null, skipped: true });
    await persistJson("@pricing-pro/auth-session", { user: null, skipped: true });
  },

  hydrate: async () => {
    const stored = await loadJson<{ user: User | null; skipped: boolean }>(
      "@pricing-pro/auth-session"
    );
    if (stored) {
      set({
        user: stored.user,
        skipped: stored.skipped,
        isHydrated: true,
      });
    } else {
      set({ isHydrated: true });
    }
  },
}));
