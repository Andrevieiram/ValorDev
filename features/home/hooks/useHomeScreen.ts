import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

import { HOME_COPY, HOME_RECENT_LIMIT, ROUTES } from '@/constants';
import { useHistoryStore, useWizardStore } from '@/store';

export function useHomeScreen() {
  const router = useRouter();
  const resetWizard = useWizardStore((s) => s.resetWizard);
  const historyItems = useHistoryStore((s) => s.items);
  const profile = useWizardStore((s) => s.profile);

  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const recentItems = useMemo(
    () => historyItems.slice(0, HOME_RECENT_LIMIT),
    [historyItems],
  );

  const startNewCalculation = useCallback(() => {
    const hasProfile = !!profile && profile.desiredIncome !== "";

    if (!hasProfile) {
      setProfileModalVisible(true);
      return;
    }

    resetWizard();
    router.push(ROUTES.wizard.intro);
  }, [resetWizard, router, profile]);

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
