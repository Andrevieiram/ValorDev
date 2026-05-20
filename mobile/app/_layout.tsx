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
