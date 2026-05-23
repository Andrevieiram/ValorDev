import { Platform, ScrollView, View, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SCREEN_CONTENT_GAP_ABOVE_TAB_BAR } from '@/constants/layout';
import { useTabBarMetrics } from '@/hooks';
import { spacing } from '@/theme';
import { AmbientBackground } from './AmbientBackground';
import { cn } from '@/utils';

interface ScreenContainerProps extends ScrollViewProps {
  scrollable?: boolean;
  withTabBar?: boolean;
  maxWidth?: 'wizard' | 'container' | 'simple' | 'none';
  className?: string;
  children: React.ReactNode;
}

export function ScreenContainer({
  scrollable = true,
  withTabBar = false,
  maxWidth = 'none',
  className,
  children,
  contentContainerStyle,
  ...props
}: ScreenContainerProps) {
  const safeInsets = useSafeAreaInsets();
  const insets = safeInsets || { top: 0, bottom: 0, left: 0, right: 0 };
  const { occupiedHeight: tabBarOccupiedHeight } = useTabBarMetrics();

  const bottomPadding = withTabBar
    ? tabBarOccupiedHeight + SCREEN_CONTENT_GAP_ABOVE_TAB_BAR
    : insets.bottom + spacing.lg;

  const isWeb = Platform.OS === 'web';
  const maxWidthValue =
    maxWidth === 'wizard'
      ? 700
      : maxWidth === 'container'
        ? 1100
        : maxWidth === 'simple'
          ? 900
          : undefined;

  const content = (
    <View
      className={cn('flex-1 bg-background px-6', className)}
      style={[
        { paddingTop: insets.top + spacing.lg, paddingBottom: bottomPadding },
        isWeb && maxWidthValue
          ? {
              maxWidth: maxWidthValue,
              width: '100%',
              alignSelf: 'center' as const,
              marginHorizontal: 'auto' as const,
            }
          : undefined,
      ]}
    >
      {children}
    </View>
  );

  if (!scrollable) {
    return (
      <>
        <AmbientBackground />
        {content}
      </>
    );
  }

  return (
    <>
      <AmbientBackground />
      <ScrollView
        className="flex-1 bg-transparent"
        contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        {...props}
      >
        {content}
      </ScrollView>
    </>
  );
}
