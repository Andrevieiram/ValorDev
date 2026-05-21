import { Pressable, View, type PressableProps, type ViewProps } from 'react-native';
import { cn } from '@/utils';

type CardVariant = 'default' | 'outlined' | 'elevated' | 'glass';

export interface CardProps extends ViewProps {
  variant?: CardVariant;
  onPress?: PressableProps['onPress'];
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-card border border-border hover:border-border/80 hover:shadow-md',
  outlined: 'bg-transparent border border-border hover:bg-card/50',
  elevated: 'bg-card border border-border shadow-lg shadow-black/5 hover:shadow-xl hover:-translate-y-1',
  glass:
    'bg-blue-50/80 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-500/10 shadow-sm dark:shadow-xl dark:shadow-black/20 hover:border-blue-300/50 dark:hover:border-blue-500/20 hover:-translate-y-[2px]',
};

export function Card({
  variant = 'default',
  onPress,
  className,
  children,
  ...props
}: CardProps) {
  const base = cn('rounded-2xl p-5 transition-all duration-300', variantStyles[variant], className);

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={cn(base, 'active:scale-[0.985] active:opacity-90')}
        style={({ pressed }) =>
          variant === 'glass'
            ? {
                transform: [{ translateY: pressed ? 0 : -1 }],
                shadowColor: '#3b82f6',
                shadowOpacity: pressed ? 0.08 : 0.12,
                shadowRadius: pressed ? 4 : 10,
                shadowOffset: { width: 0, height: pressed ? 2 : 4 },
                elevation: pressed ? 1 : 3,
              }
            : undefined
        }
        {...props}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View className={base} {...props}>
      {children}
    </View>
  );
}
