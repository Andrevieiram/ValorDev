import { ScrollView, View, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SCREEN_CONTENT_GAP_ABOVE_TAB_BAR } from '@/constants/layout';
import { useTabBarMetrics } from '@/hooks';
<<<<<<< HEAD:mobile/components/layout/ScreenContainer.tsx
import { spacing } from '@/theme';
=======
import { spacing, useTheme } from '@/theme';
import { AmbientBackground } from './AmbientBackground';
>>>>>>> 066b9274ae9ab4cd8513a16eb933b545f1194f3a:components/layout/ScreenContainer.tsx
import { cn } from '@/utils';

interface ScreenContainerProps extends ScrollViewProps {
  scrollable?: boolean;
  withTabBar?: boolean;
<<<<<<< HEAD:mobile/components/layout/ScreenContainer.tsx
=======
  maxWidth?: 'wizard' | 'container' | 'simple' | 'none';
>>>>>>> 066b9274ae9ab4cd8513a16eb933b545f1194f3a:components/layout/ScreenContainer.tsx
  className?: string;
  children: React.ReactNode;
}

export function ScreenContainer({
  scrollable = true,
  withTabBar = false,
  className,
  children,
  contentContainerStyle,
  ...props
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const { occupiedHeight: tabBarOccupiedHeight } = useTabBarMetrics();
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const isWeb = Platform.OS === 'web';

  // No mobile nativo, usamos cor hexadecimal pois CSS variables não funcionam
  // No web, deixamos o Tailwind cuidar via bg-background
  const bgColor = isDark ? '#04060a' : '#f8fafc';

  const bottomPadding = withTabBar
    ? tabBarOccupiedHeight + SCREEN_CONTENT_GAP_ABOVE_TAB_BAR
    : insets.bottom + spacing.lg;

<<<<<<< HEAD:mobile/components/layout/ScreenContainer.tsx
  const content = (
    <View
      className={cn('flex-1 bg-background px-6', className)}
      style={{ paddingTop: insets.top + spacing.lg, paddingBottom: bottomPadding }}
=======
  const maxWidthValue = maxWidth === 'wizard' ? 600 : maxWidth === 'container' ? 1200 : undefined;

  const content = (
    <View
      className={cn('flex-1 bg-background px-6', className)}
      style={[
        {
          paddingTop: insets.top + spacing.lg,
          paddingBottom: bottomPadding,
          // No nativo sobrescreve bg-background (que depende de CSS var) com hex direto
          ...(isWeb ? {} : { backgroundColor: bgColor }),
        },
        isWeb && maxWidthValue
          ? { maxWidth: maxWidthValue, width: '100%', alignSelf: 'center' as const }
          : undefined,
      ]}
>>>>>>> 066b9274ae9ab4cd8513a16eb933b545f1194f3a:components/layout/ScreenContainer.tsx
    >
      {children}
    </View>
  );

  if (!scrollable) {
    return content;
  }

  return (
<<<<<<< HEAD:mobile/components/layout/ScreenContainer.tsx
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      {...props}
    >
      {content}
    </ScrollView>
=======
    <>
      <AmbientBackground />
      <ScrollView
        className="flex-1 bg-transparent"
        style={isWeb ? undefined : { backgroundColor: bgColor }}
        contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        {...props}
      >
        {content}
      </ScrollView>
    </>
>>>>>>> 066b9274ae9ab4cd8513a16eb933b545f1194f3a:components/layout/ScreenContainer.tsx
  );
}
