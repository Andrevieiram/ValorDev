import { useRouter } from 'expo-router';
<<<<<<< HEAD:mobile/features/home/hooks/useHomeScreen.ts
import { useCallback, useMemo } from 'react';
=======
import { useCallback, useMemo, useState } from 'react';
>>>>>>> 066b9274ae9ab4cd8513a16eb933b545f1194f3a:features/home/hooks/useHomeScreen.ts

import { HOME_COPY, HOME_RECENT_LIMIT, ROUTES } from '@/constants';
import { useHistoryStore, useWizardStore } from '@/store';

export function useHomeScreen() {
  const router = useRouter();
  const resetWizard = useWizardStore((s) => s.resetWizard);
  const historyItems = useHistoryStore((s) => s.items);

  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const recentItems = useMemo(
    () => historyItems.slice(0, HOME_RECENT_LIMIT),
    [historyItems],
  );

  const startNewCalculation = useCallback(() => {
<<<<<<< HEAD:mobile/features/home/hooks/useHomeScreen.ts
=======
    const hasProfile = profile.desiredIncome !== "";

    if (!hasProfile) {
      setProfileModalVisible(true);
      return;
    }

>>>>>>> 066b9274ae9ab4cd8513a16eb933b545f1194f3a:features/home/hooks/useHomeScreen.ts
    resetWizard();
    router.push(ROUTES.wizard.intro);
  }, [resetWizard, router]);

  const confirmGoToProfile = useCallback(() => {
    setProfileModalVisible(false);
    router.push(ROUTES.setupProfile);
  }, [router]);

  const closeProfileModal = useCallback(() => {
    setProfileModalVisible(false);
  }, []);

  const goToHistory = useCallback(() => {
    router.push(ROUTES.history);
  }, [router]);

  return {
    userName: HOME_COPY.defaultUserName,
    recentItems,
    startNewCalculation,
    goToHistory,
    profileModalVisible,
    confirmGoToProfile,
    closeProfileModal,
  };
}
