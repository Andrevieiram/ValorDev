import { ScrollView, View, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SCREEN_CONTENT_GAP_ABOVE_TAB_BAR } from '@/constants/layout';
import { useTabBarMetrics } from '@/hooks';
import { spacing } from '@/theme';
import { cn } from '@/utils';

interface ScreenContainerProps extends ScrollViewProps {
  scrollable?: boolean;
  withTabBar?: boolean;
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

  const bottomPadding = withTabBar
    ? tabBarOccupiedHeight + SCREEN_CONTENT_GAP_ABOVE_TAB_BAR
    : insets.bottom + spacing.lg;

  const content = (
    <View
      className={cn('flex-1 bg-background px-6', className)}
      style={{ paddingTop: insets.top + spacing.lg, paddingBottom: bottomPadding }}
    >
      {children}
    </View>
  );

  if (!scrollable) {
    return content;
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={[{ flexGrow: 1 }, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      {...props}
    >
      {content}
    </ScrollView>
  );
}
