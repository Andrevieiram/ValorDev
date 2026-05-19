import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  TAB_BAR_INNER_HEIGHT,
  TAB_BAR_PADDING_TOP,
} from '@/constants/layout';
import { colors } from '@/theme';

/**
 * Métricas da bottom tab bar alinhadas ao safe area do dispositivo.
 * Fonte única para `(tabs)/_layout` e `ScreenContainer` (withTabBar).
 */
export function useTabBarMetrics() {
  const { bottom } = useSafeAreaInsets();

  const paddingBottom = bottom;
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
