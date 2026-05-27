import { useEffect, useRef } from 'react';
import { Animated, Text, View, type ViewProps } from 'react-native';

import { cn } from '@/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends ViewProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  label: string;
  /** Mostra o dot pulsante (ping) do design system */
  withPing?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  default: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-300', dot: '#94a3b8' },
  success: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', dot: '#10b981' },
  warning: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', dot: '#f59e0b' },
  danger:  { bg: 'bg-red-500/10',     text: 'text-red-600 dark:text-red-400',     dot: '#ef4444' },
  info:    { bg: 'bg-blue-500/10',    text: 'text-blue-600 dark:text-blue-400',    dot: '#3b82f6' },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5',
  md: 'px-3 py-1',
};

const sizeTextStyles: Record<BadgeSize, string> = {
  sm: 'text-[10px]',
  md: 'text-xs',
};

/**
 * Badge com suporte ao dot pulsante (ping animado) do design_system.html.
 * Use `withPing` para habilitar o dot animado ao lado do label.
 */
export function Badge({
  variant = 'default',
  size = 'md',
  label,
  withPing = false,
  className,
  ...props
}: BadgeProps) {
  const pingScale = useRef(new Animated.Value(1)).current;
  const pingOpacity = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    if (!withPing) return;
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(pingScale, { toValue: 2, duration: 900, useNativeDriver: true }),
          Animated.timing(pingScale, { toValue: 1, duration: 0, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(pingOpacity, { toValue: 0, duration: 900, useNativeDriver: true }),
          Animated.timing(pingOpacity, { toValue: 0.7, duration: 0, useNativeDriver: true }),
        ]),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [withPing]);

  const styles = variantStyles[variant];

  return (
    <View
      className={cn('self-start rounded-full flex-row items-center gap-1.5', styles.bg, sizeStyles[size], className)}
      {...props}
    >
      {withPing && (
        <View style={{ width: 8, height: 8, alignItems: 'center', justifyContent: 'center' }}>
          {/* Anel pulsante */}
          <Animated.View
            style={{
              position: 'absolute',
              width: 8, height: 8,
              borderRadius: 4,
              backgroundColor: styles.dot,
              transform: [{ scale: pingScale }],
              opacity: pingOpacity,
            }}
          />
          {/* Dot sólido central */}
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: styles.dot }} />
        </View>
      )}

      <Text className={cn('font-semibold', styles.text, sizeTextStyles[size])}>
        {label}
      </Text>
    </View>
  );
}
