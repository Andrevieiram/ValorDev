import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';

import { HOME_COPY, HOME_RECENT_LIMIT, ROUTES } from '@/constants';
import { useHistoryStore, useWizardStore } from '@/store';

export function useHomeScreen() {
  const router = useRouter();
  const resetWizard = useWizardStore((s) => s.resetWizard);
  const historyItems = useHistoryStore((s) => s.items);

  const recentItems = useMemo(
    () => historyItems.slice(0, HOME_RECENT_LIMIT),
    [historyItems],
  );

  const startNewCalculation = useCallback(() => {
    resetWizard();
    router.push(ROUTES.wizard.intro);
  }, [resetWizard, router]);

  const goToHistory = useCallback(() => {
    router.push(ROUTES.history);
  }, [router]);

  return {
    userName: HOME_COPY.defaultUserName,
    recentItems,
    startNewCalculation,
    goToHistory,
  };
}
