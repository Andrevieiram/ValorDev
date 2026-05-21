import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform, useColorScheme as useRNColorScheme } from "react-native";
import { useColorScheme as useNWColorScheme } from "nativewind";
import { useSettingsStore } from "@/store/settings.store";
import { lightPalette, darkPalette } from "./colors";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  colors: typeof lightPalette | typeof darkPalette;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/** Aplica classe "dark" no <html> para que o Tailwind CSS no web funcione */
function applyDOMClass(theme: Theme) {
  if (Platform.OS !== "web") return;
  try {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  } catch {
    // SSR / non-browser — ignorar silenciosamente
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const settingsTheme = useSettingsStore((s) => s.theme);
  const setThemeStore = useSettingsStore((s) => s.setTheme);

  // NativeWind setColorScheme — funciona agora que darkMode: 'class' está no tailwind.config.js
  const { setColorScheme } = useNWColorScheme();

  // Estado local do tema ativo
  const [activeTheme, setActiveTheme] = useState<Theme>(settingsTheme ?? "light");

  // Sincronizar quando o tema da store muda (ex: após hidratação do AsyncStorage)
  useEffect(() => {
    const t = settingsTheme ?? "light";
    setActiveTheme(t);
    applyDOMClass(t);

    // Informa o NativeWind — ativa as classes dark: nos componentes RN
    try {
      setColorScheme(t);
    } catch {
      // Ignorar se ainda não inicializado
    }
  }, [settingsTheme]);

  // Aplicar no primeiro mount
  useEffect(() => {
    applyDOMClass(activeTheme);
    try {
      setColorScheme(activeTheme);
    } catch {
      //
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeColors = activeTheme === "dark" ? darkPalette : lightPalette;

  const applyTheme = (t: Theme) => {
    setActiveTheme(t);
    applyDOMClass(t);
    try {
      setColorScheme(t);
    } catch {
      //
    }
    setThemeStore(t);
  };

  const toggleTheme = () => {
    applyTheme(activeTheme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: activeTheme,
        colors: activeColors,
        toggleTheme,
        setTheme: applyTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
