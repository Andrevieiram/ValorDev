import '../global.css';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { colors } from '@/theme';
import { useHistoryStore, useWizardStore } from '@/store';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

<<<<<<< HEAD:mobile/app/_layout.tsx
=======
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
        options={{ title: 'Perfil Financeiro', presentation: 'card', headerBackTitle: 'Voltar' }}
      />
      <Stack.Screen
        name="result"
        options={{ title: 'Resultado', headerBackTitle: 'Voltar' }}
      />
      <Stack.Screen
        name="settings"
        options={{ title: 'Configurações', presentation: 'card', headerBackTitle: 'Voltar' }}
      />
      <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
    </Stack>
  );
}

>>>>>>> 066b9274ae9ab4cd8513a16eb933b545f1194f3a:app/_layout.tsx
export default function RootLayout() {
  useEffect(() => {
    Promise.all([
      useWizardStore.getState().hydrateFromStorage(),
      useHistoryStore.getState().hydrate(),
    ]).finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.foreground,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="wizard"
          options={{ headerShown: false, presentation: 'card' }}
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
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
