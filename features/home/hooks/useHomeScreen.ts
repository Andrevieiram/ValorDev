import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState, useEffect } from 'react';

import { HOME_COPY, HOME_RECENT_LIMIT, ROUTES } from '@/constants';
import { useHistoryStore, useWizardStore, useAuthStore } from '@/store';
import { profileApi } from '@/api/profile.api';

export function useHomeScreen() {
  const router = useRouter();
  const resetWizard = useWizardStore((s) => s.resetWizard);
  const setProfile = useWizardStore((s) => s.setProfile);
  const historyItems = useHistoryStore((s) => s.items);
  const user = useAuthStore((s) => s.user);
  const profile = useWizardStore((s) => s.profile);

  const [profileModalVisible, setProfileModalVisible] = useState(false);

  // Carrega o perfil do backend ao montar a Home se o usuário estiver logado e sem perfil local
  useEffect(() => {
    const checkAndHydrateProfile = async () => {
      if (user && !profile.desiredIncome) {
        try {
          const data = await profileApi.getProfile();
          if (data) {
            const backendValues = {
              desiredIncome: Math.round(Number(data.desiredIncome) * 100).toString(),
              hoursPerWeek: String(data.hoursPerWeek),
              monthlyCosts: Math.round(Number(data.monthlyCosts) * 100).toString(),
              financialReserve: Math.round(Number(data.financialReserve) * 100).toString(),
              experienceLevel: data.experienceLevel || 'pleno',
              taxRegime: data.taxRegime || 'mei',
              mainStack: data.mainStack || 'fullstack',
              workload: data.workload || 'normal',
            };
            setProfile(backendValues);
          }
        } catch (err) {
          console.warn('[useHomeScreen] Não foi possível carregar perfil do backend:', err);
        }
      }
    };
    checkAndHydrateProfile();
  }, [user, profile.desiredIncome, setProfile]);

  const recentItems = useMemo(
    () => historyItems.slice(0, HOME_RECENT_LIMIT),
    [historyItems],
  );

  const startNewCalculation = useCallback(() => {
    const hasProfile = profile.desiredIncome !== "";

    if (!hasProfile) {
      setProfileModalVisible(true);
      return;
    }

    resetWizard();
    router.push(ROUTES.wizard.intro);
  }, [resetWizard, router, profile.desiredIncome]);

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
    userName: user?.name || HOME_COPY.defaultUserName,
    recentItems,
    startNewCalculation,
    goToHistory,
    profileModalVisible,
    confirmGoToProfile,
    closeProfileModal,
  };
}
