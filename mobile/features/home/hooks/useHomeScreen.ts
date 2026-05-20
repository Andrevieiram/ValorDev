import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Alert } from 'react-native';

import { HOME_COPY, HOME_RECENT_LIMIT, ROUTES } from '@/constants';
import { useHistoryStore, useWizardStore, useAuthStore } from '@/store';

export function useHomeScreen() {
  const router = useRouter();
  const resetWizard = useWizardStore((s) => s.resetWizard);
  const historyItems = useHistoryStore((s) => s.items);
  const user = useAuthStore((s) => s.user);
  const profile = useWizardStore((s) => s.profile);

  const recentItems = useMemo(
    () => historyItems.slice(0, HOME_RECENT_LIMIT),
    [historyItems],
  );

  const startNewCalculation = useCallback(() => {
    const hasProfile = profile.desiredIncome !== "";
    
    if (!hasProfile) {
      Alert.alert(
        "Perfil Financeiro Requerido",
        "Para calcular o orçamento de um projeto, você precisa configurar seu perfil financeiro primeiro.",
        [
          { text: "Configurar agora", onPress: () => router.push(ROUTES.setupProfile) },
          { text: "Cancelar", style: "cancel" }
        ]
      );
      return;
    }

    resetWizard();
    router.push(ROUTES.wizard.intro);
  }, [resetWizard, router, profile.desiredIncome]);

  const goToHistory = useCallback(() => {
    router.push(ROUTES.history);
  }, [router]);

  return {
    userName: user?.name || HOME_COPY.defaultUserName,
    recentItems,
    startNewCalculation,
    goToHistory,
  };
}
