import { forwardRef } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  type PressableProps,
  Text,
  View,
} from 'react-native';

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
<<<<<<< HEAD:mobile/components/ui/Button.tsx
=======
    textStyle,
    style: customStyle,
>>>>>>> 066b9274ae9ab4cd8513a16eb933b545f1194f3a:components/ui/Button.tsx
    ...props
  },
  ref,
) {
  const isDisabled = disabled || isLoading;
  const content = children ?? label;
<<<<<<< HEAD:mobile/components/ui/Button.tsx
=======
  const { colors, theme } = useTheme();
  const isWeb = Platform.OS === 'web';
  const isDark = theme === 'dark';

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
          'overflow-hidden rounded-xl',
          isDisabled && 'opacity-50',
          className
        )}
        style={(state) => [
          {
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
        <LinearGradient
          colors={['#2563eb', '#06b6d4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            {
              alignItems: 'center',
              justifyContent: 'center',
              ...sizePadding[size],
            },
          ]}
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
          'flex-row items-center justify-center rounded-xl',
          isDisabled && 'opacity-50',
          className,
        )}
        style={(state) => [
          {
            borderWidth: 1.5,
            borderColor: colors.primary,
            backgroundColor: state.pressed ? `${colors.primary}15` : 'transparent',
            transform: [{ scale: state.pressed ? 0.98 : 1 }],
            ...sizePadding[size],
          },
          resolveCustomStyle(state),
        ]}
        {...props}
      >
        {textNode(colors.primary)}
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
>>>>>>> 066b9274ae9ab4cd8513a16eb933b545f1194f3a:components/ui/Button.tsx

  // destructive
  return (
    <Pressable
      ref={ref}
      disabled={isDisabled}
      className={cn(
<<<<<<< HEAD:mobile/components/ui/Button.tsx
        'flex-row items-center justify-center rounded-xl min-h-[48px]',
        variantStyles[variant],
        sizeStyles[size],
=======
        'flex-row items-center justify-center rounded-xl',
>>>>>>> 066b9274ae9ab4cd8513a16eb933b545f1194f3a:components/ui/Button.tsx
        isDisabled && 'opacity-50',
        className,
      )}
      style={(state) => [
        {
          backgroundColor: state.pressed ? '#dc2626' : colors.danger,
          transform: [{ scale: state.pressed ? 0.98 : 1 }],
          ...sizePadding[size],
        },
        resolveCustomStyle(state),
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'destructive' ? '#fff' : '#18181b'}
        />
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
