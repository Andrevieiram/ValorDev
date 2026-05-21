import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  TAB_BAR_INNER_HEIGHT,
  TAB_BAR_PADDING_TOP,
} from '@/constants/layout';
import { useTheme } from '@/theme';

/**
 * Métricas da bottom tab bar alinhadas ao safe area do dispositivo.
 * Fonte única para `(tabs)/_layout` e `ScreenContainer` (withTabBar).
 */
export function useTabBarMetrics() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const bottom = insets?.bottom ?? 0;
  const paddingBottom = bottom > 0 ? bottom : 8; // Garante um respiro mínimo na web/android sem navegação por gestos
  const height = TAB_BAR_PADDING_TOP + TAB_BAR_INNER_HEIGHT + paddingBottom;

  return {
    height,
    paddingBottom,
    paddingTop: TAB_BAR_PADDING_TOP,
    /** Altura total que a tab bar ocupa na tela */
    occupiedHeight: height,
    tabBarStyle: {
      backgroundColor: colors.card,
      borderTopColor: colors.border,
      borderTopWidth: 1 as const,
      height,
      paddingTop: TAB_BAR_PADDING_TOP,
      paddingBottom,
    },
  };
}
