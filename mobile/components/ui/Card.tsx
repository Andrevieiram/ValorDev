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
    'bg-slate-900/40 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/30 hover:border-primary/30 hover:-translate-y-[2px]',
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
                shadowColor: '#2563eb',
                shadowOpacity: pressed ? 0.06 : 0.03,
                shadowRadius: pressed ? 8 : 24,
                shadowOffset: { width: 0, height: pressed ? 4 : 8 },
                elevation: pressed ? 2 : 6,
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
