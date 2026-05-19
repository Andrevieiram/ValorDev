import type { ReactNode } from 'react';
import type { ViewProps } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { cn } from '@/utils';

interface AnimatedSectionProps extends ViewProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Wrapper para entradas animadas — usar em seções de tela.
 * Ajuste `delay` para efeito cascata (ex.: Home).
 */
export function AnimatedSection({
  children,
  delay = 0,
  className,
  ...props
}: AnimatedSectionProps) {
  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(delay)}
      className={cn(className)}
      {...props}
    >
      {children}
    </Animated.View>
  );
}
