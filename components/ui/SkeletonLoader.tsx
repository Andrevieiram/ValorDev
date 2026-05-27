import { View } from 'react-native';

interface SkeletonLoaderProps {
  height?: number;
  width?: string | number;
  borderRadius?: number;
  className?: string;
}

export function SkeletonLoader({
  height = 16,
  width = '100%',
  borderRadius = 8,
  className = '',
}: SkeletonLoaderProps) {
  return (
    <View
      className={`bg-muted ${className}`}
      style={{
        height,
        width,
        borderRadius,
      }}
    />
  );
}

interface SkeletonCardProps {
  count?: number;
}

export function SkeletonCard({ count = 3 }: SkeletonCardProps) {
  return (
    <View className="gap-3 p-4 rounded-2xl border border-border dark:border-white/5 bg-slate-50 dark:bg-slate-900/20">
      {Array.from({ length: count }).map((_, i) => (
        <View key={i} className="gap-2">
          <SkeletonLoader height={14} width="40%" />
          <SkeletonLoader height={12} width="100%" />
        </View>
      ))}
    </View>
  );
}
