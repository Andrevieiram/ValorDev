import { forwardRef } from 'react';
import {
  ActivityIndicator,
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

const sizeTextStyles: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
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
    ...props
  },
  ref,
) {
  const isDisabled = disabled || isLoading;
  const content = children ?? label;

  return (
    <Pressable
      ref={ref}
      disabled={isDisabled}
      className={cn(
        'flex-row items-center justify-center rounded-xl min-h-[48px]',
        variantStyles[variant],
        sizeStyles[size],
        isDisabled && 'opacity-50',
        className,
      )}
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
