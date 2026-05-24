import { Text, View, type ViewProps } from 'react-native';

import { cn } from '@/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';
type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends ViewProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  label: string;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-muted',
  success: 'bg-success-light',
  warning: 'bg-warning-light',
  danger: 'bg-destructive/10',
  info: 'bg-info-light',
};

const variantTextStyles: Record<BadgeVariant, string> = {
  default: 'text-foreground',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-destructive',
  info: 'text-info',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5',
  md: 'px-3 py-1',
};

const sizeTextStyles: Record<BadgeSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
};

export function Badge({
  variant = 'default',
  size = 'md',
  label,
  className,
  ...props
}: BadgeProps) {
  return (
    <View
      className={cn(
        'self-start rounded-full',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      <Text
        className={cn(
          'font-medium',
          variantTextStyles[variant],
          sizeTextStyles[size],
        )}
      >
        {label}
      </Text>
    </View>
  );
}
