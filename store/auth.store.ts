import { create } from 'zustand';
import { loadSensitiveJson, persistSensitiveJson, removeSensitivePersisted } from './persistence';
import { authApi } from '@/api/auth.api';

interface User {
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  skipped: boolean;
  isHydrated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  skipAuth: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  skipped: false,
  isHydrated: false,

  login: async (email, password) => {
    try {
      const response = await authApi.login(email, password);
      set({
        user: { name: response.name, email: response.email },
        token: response.token,
        skipped: false,
      });
      // Armazenar token e usuário
      await persistSensitiveJson('pricing-pro.auth-session', {
        user: { name: response.name, email: response.email },
        token: response.token,
        skipped: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'E-mail ou senha inválidos';
      throw new Error(message);
    }
  },

  register: async (name, email, password) => {
    try {
      const response = await authApi.register(name, email, password);
      set({
        user: { name: response.name, email: response.email },
        token: response.token,
        skipped: false,
      });
      // Armazenar token e usuário
      await persistSensitiveJson('pricing-pro.auth-session', {
        user: { name: response.name, email: response.email },
        token: response.token,
        skipped: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao registrar';
      throw new Error(message);
    }
  },

  logout: async () => {
    set({ user: null, token: null, skipped: false });
    await removeSensitivePersisted('pricing-pro.auth-session');
  },

  skipAuth: async () => {
    set({ user: null, token: null, skipped: true });
    await persistSensitiveJson('pricing-pro.auth-session', {
      user: null,
      token: null,
      skipped: true,
    });
  },

  hydrate: async () => {
    try {
      const stored = await loadSensitiveJson<{
        user: User | null;
        token: string | null;
        skipped: boolean;
      }>('pricing-pro.auth-session');

      if (stored) {
        if (stored.user && stored.token) {
          set({
            user: stored.user,
            token: stored.token,
            skipped: stored.skipped,
            isHydrated: true,
          });
        } else if (stored.skipped) {
          set({
            user: null,
            token: null,
            skipped: true,
            isHydrated: true,
          });
        } else {
          set({ isHydrated: true });
        }
      } else {
        set({ isHydrated: true });
      }
    } catch (error) {
      console.error('Error hydrating auth store:', error);
      set({ isHydrated: true });
    }
  },
}));
