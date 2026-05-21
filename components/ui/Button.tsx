import { forwardRef } from 'react';
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  type TextStyle,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { cn } from '@/utils';
import { useTheme } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends PressableProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  label?: string;
  leftIcon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  textClassName?: string;
  /** Override de style para o texto (cor, fontFamily, etc.) */
  textStyle?: TextStyle;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2.5 min-h-[36px]',
  md: 'px-6 py-3 min-h-[44px]',
  lg: 'px-8 py-3.5 min-h-[50px]',
};

const sizeTextStyles: Record<ButtonSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export const Button = forwardRef<View, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    label,
    leftIcon,
    children,
    className,
    textClassName,
    textStyle,
    ...props
  },
  ref,
) {
  const isDisabled = disabled || isLoading;
  const content = children ?? label;
  const { colors } = useTheme();

  const textNode = (defaultColor: string, defaultFontFamily = 'Inter_600SemiBold') =>
    isLoading ? (
      <ActivityIndicator color={defaultColor} />
    ) : typeof content === 'string' || typeof content === 'number' ? (
      <View className="flex-row items-center justify-center gap-2">
        {leftIcon}
        <Text
          className={cn(
            'text-center tracking-wide',
            sizeTextStyles[size],
            textClassName,
          )}
          style={[
            { color: defaultColor, fontFamily: defaultFontFamily },
            textStyle,
          ]}
        >
          {content}
        </Text>
      </View>
    ) : (
      content
    );

  if (variant === 'primary') {
    return (
      <Pressable
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'overflow-hidden rounded-xl transition-all duration-300',
          'hover:scale-[1.02] hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)]',
          'active:scale-[0.98]',
          isDisabled && 'opacity-50',
          className
        )}
        style={({ pressed }) => ({
          shadowColor: '#2563eb',
          shadowOffset: { width: 0, height: pressed ? 2 : 6 },
          shadowOpacity: pressed ? 0.2 : 0.35,
          shadowRadius: pressed ? 4 : 16,
          elevation: pressed ? 2 : 8,
        })}
        {...props}
      >
        <LinearGradient
          colors={['#2563eb', '#06b6d4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className={cn('items-center justify-center', sizeStyles[size])}
        >
          {textNode('#ffffff', 'Inter_600SemiBold')}
        </LinearGradient>
      </Pressable>
    );
  }

  if (variant === 'secondary') {
    return (
      <Pressable
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'flex-row items-center justify-center rounded-xl border border-primary bg-transparent',
          'transition-all duration-300 hover:bg-primary/5 active:bg-primary/10 active:scale-[0.98]',
          sizeStyles[size],
          isDisabled && 'opacity-50',
          className,
        )}
        {...props}
      >
        {textNode(colors.primary)}
      </Pressable>
    );
  }

  if (variant === 'ghost') {
    return (
      <Pressable
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'flex-row items-center justify-center rounded-xl border border-border bg-card',
          'transition-all duration-300 hover:bg-muted/80 hover:border-primary/30 active:bg-muted active:scale-[0.98]',
          sizeStyles[size],
          isDisabled && 'opacity-50',
          className,
        )}
        {...props}
      >
        {textNode(colors.mutedForeground, 'Inter_500Medium')}
      </Pressable>
    );
  }

  return (
    <Pressable
      ref={ref}
      disabled={isDisabled}
      className={cn(
        'flex-row items-center justify-center rounded-xl bg-destructive active:bg-destructive/90',
        sizeStyles[size],
        isDisabled && 'opacity-50',
        className,
      )}
      {...props}
    >
      {textNode('#ffffff')}
    </Pressable>
  );
});
