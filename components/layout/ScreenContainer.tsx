import { ScrollView, View, type ScrollViewProps, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SCREEN_CONTENT_GAP_ABOVE_TAB_BAR } from '@/constants/layout';
import { useTabBarMetrics } from '@/hooks';
import { spacing } from '@/theme';
import { useTheme } from '@/theme/ThemeContext';
import { AmbientBackground } from './AmbientBackground';
import { cn } from '@/utils';

interface ScreenContainerProps extends ScrollViewProps {
  readonly scrollable?: boolean;
  readonly withTabBar?: boolean;
  readonly maxWidth?: 'wizard' | 'container' | 'simple' | 'none';
  readonly className?: string;
  readonly children: React.ReactNode;
}

export function ScreenContainer({
  scrollable = true,
  withTabBar = false,
  maxWidth,
  className,
  children,
  contentContainerStyle,
  ...props
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const { occupiedHeight: tabBarOccupiedHeight } = useTabBarMetrics();
  const themeContext = useTheme();
  const theme = themeContext?.theme || 'light';

  const isDark = theme === 'dark';
  const isWeb = Platform.OS === 'web';

  // No mobile nativo, usamos cor hexadecimal pois CSS variables não funcionam
  // No web, deixamos o Tailwind cuidar via bg-background
  const bgColor = isDark ? '#04060a' : '#f8fafc';

  const bottomPadding = withTabBar
    ? tabBarOccupiedHeight + SCREEN_CONTENT_GAP_ABOVE_TAB_BAR
    : insets.bottom + spacing.lg;

  let maxWidthValue: number | undefined = undefined;
  if (maxWidth === 'wizard') {
    maxWidthValue = 600;
  } else if (maxWidth === 'container') {
    maxWidthValue = 1200;
  }

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
    >
      {children}
    </View>
  );

  if (!scrollable) {
    return content;
  }

  return (
    <View style={{ flex: 1 }}>
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
    </View>
  );
}
