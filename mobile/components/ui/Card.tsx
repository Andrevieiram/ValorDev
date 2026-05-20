import { Pressable, View, type PressableProps, type ViewProps } from 'react-native';

import { cn } from '@/utils';

type CardVariant = 'default' | 'outlined' | 'elevated';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  onPress?: PressableProps['onPress'];
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-card border border-border',
  outlined: 'bg-transparent border-2 border-border',
  elevated: 'bg-card border border-border shadow-sm',
};

export function Card({
  variant = 'default',
  onPress,
  className,
  children,
  ...props
}: CardProps) {
  const baseClassName = cn('rounded-2xl p-6', variantStyles[variant], className);

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={cn(baseClassName, 'active:opacity-95')}
        {...props}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View className={baseClassName} {...props}>
      {children}
    </View>
  );
}
