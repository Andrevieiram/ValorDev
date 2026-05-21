import { View, type ViewProps } from 'react-native';

import { cn } from '@/utils';

type ProgressVariant = 'default' | 'success' | 'warning' | 'danger';

export interface ProgressProps extends ViewProps {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  className?: string;
  trackClassName?: string;
}

const fillVariantStyles: Record<ProgressVariant, string> = {
  default: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-destructive',
};

export function Progress({
  value,
  max = 100,
  variant = 'default',
  className,
  trackClassName,
  ...props
}: ProgressProps) {
  const clamped = Math.min(Math.max(value, 0), max);
  const percentage = (clamped / max) * 100;

  return (
    <View
      className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', trackClassName)}
      {...props}
    >
      <View
        className={cn('h-full rounded-full', fillVariantStyles[variant])}
        style={{ width: `${percentage}%` }}
      />
    </View>
  );
}
