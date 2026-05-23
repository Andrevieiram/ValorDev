import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
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
  const isHydrated = useSettingsStore((s) => s.isHydrated);
  const setThemeStore = useSettingsStore((s) => s.setTheme);

  // NativeWind setColorScheme — aplica dark: classes no React Native nativo
  const { setColorScheme } = useNWColorScheme();

  // Estado local do tema ativo
  const [activeTheme, setActiveTheme] = useState<Theme>("light");

  // Sincroniza APÓS a hidratação do AsyncStorage estar completa
  // Isso garante que o tema salvo seja aplicado corretamente no mobile
  useEffect(() => {
    if (!isHydrated) return; // Aguarda a store estar hidratada
    const t = settingsTheme ?? "light";
    setActiveTheme(t);
    applyDOMClass(t);
    try {
      setColorScheme(t);
    } catch {
      // Ignorar se ainda não inicializado
    }
  }, [settingsTheme, isHydrated]);

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
