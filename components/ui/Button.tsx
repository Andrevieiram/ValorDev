import { forwardRef } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  type PressableProps,
  Text,
  View,
} from 'react-native';

import { useTheme } from '@/theme/ThemeContext';
import { cn } from '@/utils';

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
  textStyle?: any;
  style?: any;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-primary active:bg-primary/90',
  secondary: 'bg-secondary active:bg-secondary/80',
  ghost: 'bg-transparent active:bg-muted',
  destructive: 'bg-destructive active:bg-destructive/90',
};

const variantTextStyles: Record<ButtonVariant, string> = {
  primary: 'text-primary-foreground',
  secondary: 'text-secondary-foreground',
  ghost: 'text-foreground',
  destructive: 'text-destructive-foreground',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2',
  md: 'px-6 py-3',
  lg: 'px-8 py-4',
};

const sizePadding: Record<ButtonSize, { paddingHorizontal: number; paddingVertical: number; minHeight: number }> = {
  sm: { paddingHorizontal: 16, paddingVertical: 10, minHeight: 36 },
  md: { paddingHorizontal: 24, paddingVertical: 12, minHeight: 44 },
  lg: { paddingHorizontal: 32, paddingVertical: 14, minHeight: 50 },
};

const sizeTextStyles: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const sizeTextSize: Record<ButtonSize, number> = {
  sm: 12,
  md: 14,
  lg: 16,
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
    style: customStyle,
    ...props
  },
  ref,
) {
  const isDisabled = disabled || isLoading;
  const content = children ?? label;
  const themeContext = useTheme();
  const { colors, theme } = themeContext || {};
  const isWeb = Platform.OS === 'web';
  const isDark = theme === 'dark';
  const primaryColor = colors?.primary || '#2563eb';

  const resolveCustomStyle = (state: any) =>
    typeof customStyle === 'function' ? customStyle(state) : customStyle;

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
            { color: defaultColor, fontFamily: defaultFontFamily, fontSize: sizeTextSize[size] },
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
          'flex-row items-center justify-center rounded-xl bg-primary',
          isDisabled && 'opacity-50',
          className
        )}
        style={(state) => [
          {
            ...sizePadding[size],
            backgroundColor: state.pressed ? '#1d4ed8' : '#2563eb',
            shadowColor: '#2563eb',
            shadowOffset: { width: 0, height: state.pressed ? 2 : 6 },
            shadowOpacity: state.pressed ? 0.2 : 0.35,
            shadowRadius: state.pressed ? 4 : 16,
            elevation: state.pressed ? 2 : 8,
            transform: [{ scale: state.pressed ? 0.98 : 1 }],
          },
          resolveCustomStyle(state),
        ]}
        {...props}
      >
        {textNode('#ffffff', 'Inter_600SemiBold')}
      </Pressable>
    );
  }

  if (variant === 'secondary') {
    return (
      <Pressable
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'flex-row items-center justify-center rounded-xl',
          isDisabled && 'opacity-50',
          className,
        )}
        style={(state) => [
          {
            borderWidth: 1.5,
            borderColor: primaryColor,
            backgroundColor: state.pressed ? `${primaryColor}15` : 'transparent',
            transform: [{ scale: state.pressed ? 0.98 : 1 }],
            ...sizePadding[size],
          },
          resolveCustomStyle(state),
        ]}
        {...props}
      >
        {textNode(primaryColor)}
      </Pressable>
    );
  }

  if (variant === 'ghost') {
    const ghostBg = isDark ? '#1e293b' : '#ffffff';
    const ghostBorder = isDark ? '#334155' : '#e2e8f0';
    const ghostText = isDark ? '#94a3b8' : '#64748b';

    return (
      <Pressable
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'flex-row items-center justify-center rounded-xl',
          isDisabled && 'opacity-50',
          className,
        )}
        style={(state) => [
          {
            borderWidth: 1,
            borderColor: ghostBorder,
            backgroundColor: state.pressed ? (isDark ? '#334155' : '#f1f5f9') : ghostBg,
            transform: [{ scale: state.pressed ? 0.98 : 1 }],
            ...sizePadding[size],
          },
          isWeb ? { backgroundColor: undefined, borderColor: undefined } : {},
          resolveCustomStyle(state),
        ]}
        {...props}
      >
        {textNode(ghostText, 'Inter_500Medium')}
      </Pressable>
    );
  }

  // destructive
  return (
    <Pressable
      ref={ref}
      disabled={isDisabled}
      className={cn(
        'flex-row items-center justify-center rounded-xl',
        isDisabled && 'opacity-50',
        className,
      )}
      style={(state) => [
        {
          backgroundColor: state.pressed ? '#b91c1c' : '#ef4444',
          transform: [{ scale: state.pressed ? 0.98 : 1 }],
          ...sizePadding[size],
        },
        resolveCustomStyle(state),
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : typeof content === 'string' || typeof content === 'number' ? (
        <View className="flex-row items-center justify-center gap-2">
          {leftIcon}
          <Text
            className={cn(
              'font-medium text-center',
              variantTextStyles[variant],
              sizeTextStyles[size],
              textClassName,
            )}
          >
            {content}
          </Text>
        </View>
      ) : (
        content
      )}
    </Pressable>
  );
});
