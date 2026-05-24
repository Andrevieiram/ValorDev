import { create } from "zustand";
import { loadSensitiveJson, persistSensitiveJson, removeSensitivePersisted } from "./persistence";
import { hashPassword, comparePassword } from "@/utils/password";

interface User {
  name: string;
  email: string;
}

interface StoredUser extends User {
  passwordHash: string;
}

interface LoginAttempt {
  email: string;
  count: number;
  lockedUntil: number | null;
}

interface AuthState {
  user: User | null;
  skipped: boolean;
  isHydrated: boolean;
  loginAttempts: Map<string, LoginAttempt>;

  login: (email: string, password: string, name?: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  skipAuth: () => Promise<void>;
  hydrate: () => Promise<void>;
}

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutos

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  skipped: false,
  isHydrated: false,
  loginAttempts: new Map(),

  login: async (email, password, name = "Desenvolvedor") => {
    const attempts = get().loginAttempts;
    const attempt = attempts.get(email);

    // Verificar se está bloqueado
    if (attempt && attempt.lockedUntil && attempt.lockedUntil > Date.now()) {
      const minutesLeft = Math.ceil((attempt.lockedUntil - Date.now()) / 60000);
      throw new Error(`Conta bloqueada. Tente novamente em ${minutesLeft} minutos.`);
    }

    // Resetar se o lockout expirou
    if (attempt && attempt.lockedUntil && attempt.lockedUntil <= Date.now()) {
      attempts.delete(email);
    }

    const stored = await loadSensitiveJson<{ user: StoredUser | null; skipped: boolean }>(
      "@pricing-pro/auth-session"
    );

    if (!stored || !stored.user || stored.user.email !== email) {
      // Incrementar tentativas falhas
      const newAttempt = attempt ? { ...attempt, count: attempt.count + 1 } : { email, count: 1, lockedUntil: null };

      if (newAttempt.count >= MAX_LOGIN_ATTEMPTS) {
        newAttempt.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      }

      attempts.set(email, newAttempt);
      set({ loginAttempts: new Map(attempts) });

      throw new Error("E-mail ou senha inválidos");
    }

    const isPasswordValid = await comparePassword(password, stored.user.passwordHash);
    if (!isPasswordValid) {
      // Incrementar tentativas falhas
      const newAttempt = attempt ? { ...attempt, count: attempt.count + 1 } : { email, count: 1, lockedUntil: null };

      if (newAttempt.count >= MAX_LOGIN_ATTEMPTS) {
        newAttempt.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
      }

      attempts.set(email, newAttempt);
      set({ loginAttempts: new Map(attempts) });

      throw new Error("E-mail ou senha inválidos");
    }

    // Login bem-sucedido: limpar tentativas e defazer lockout
    attempts.delete(email);
    const user: User = { name: stored.user.name, email: stored.user.email };
    set({ user, skipped: false, loginAttempts: new Map(attempts) });
  },

  register: async (name, email, password) => {
    const passwordHash = await hashPassword(password);
    const storedUser: StoredUser = { name, email, passwordHash };
    set({ user: { name, email }, skipped: false });
    await persistSensitiveJson("@pricing-pro/auth-session", { user: storedUser, skipped: false });
  },

  logout: async () => {
    // Limpar estado de autenticação
    set({ user: null, skipped: false });
    // Remover sessão criptografada
    await removeSensitivePersisted("@pricing-pro/auth-session");
    // Nota: wizard e histórico são mantidos para referência futura
  },

  skipAuth: async () => {
    set({ user: null, skipped: true });
    await persistSensitiveJson("@pricing-pro/auth-session", { user: null, skipped: true });
  },

  hydrate: async () => {
    const stored = await loadSensitiveJson<{ user: StoredUser | null; skipped: boolean }>(
      "@pricing-pro/auth-session"
    );
    if (stored && stored.user) {
      const user: User = { name: stored.user.name, email: stored.user.email };
      set({
        user,
        skipped: stored.skipped,
        isHydrated: true,
      });
    } else {
      set({ isHydrated: true });
    }
  },
}));
