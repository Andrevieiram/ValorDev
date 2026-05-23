import '../global.css';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { JetBrainsMono_400Regular, JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono';
import 'react-native-reanimated';

import { ThemeProvider, useTheme } from '@/theme';
import { useHistoryStore, useWizardStore, useSettingsStore, useAuthStore } from '@/store';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

function InnerLayout() {
  const { colors, theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: isDark ? "#0f172a" : "#ffffff" },
        headerTintColor: isDark ? "#f8fafc" : "#0f172a",
        headerTitleStyle: { fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
        contentStyle: { backgroundColor: isDark ? "#04060a" : "#f8fafc" },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="auth" options={{ headerShown: false, contentStyle: { backgroundColor: '#060919' } }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="wizard"
        options={{ headerShown: false, presentation: 'card' }}
      />
      <Stack.Screen
        name="setup-profile"
        options={{ title: 'Perfil Financeiro', presentation: 'card' }}
      />
      <Stack.Screen
        name="result"
        options={{ title: 'Resultado', headerBackTitle: 'Voltar' }}
      />
      <Stack.Screen
        name="settings"
        options={{ title: 'Configurações', presentation: 'card' }}
      />
      <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold,
  });

  useEffect(() => {
    if (!fontsLoaded && !fontError) return;

    Promise.all([
      useWizardStore.getState().hydrateFromStorage(),
      useHistoryStore.getState().hydrate(),
      useSettingsStore.getState().hydrate(),
      useAuthStore.getState().hydrate(),
    ]).finally(() => {
      SplashScreen.hideAsync();
    });
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <InnerLayout />
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
