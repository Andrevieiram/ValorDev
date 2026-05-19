import { Pressable, Text, View } from 'react-native';

import { HOME_COPY } from '@/constants';
import type { HistoryItem } from '@/types';

import { RecentCalculationCard } from './RecentCalculationCard';

interface RecentCalculationsSectionProps {
  items: HistoryItem[];
  onSeeAll: () => void;
  onItemPress?: (item: HistoryItem) => void;
}

export function RecentCalculationsSection({
  items,
  onSeeAll,
  onItemPress,
}: RecentCalculationsSectionProps) {
  if (items.length === 0) return null;

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-foreground">
          {HOME_COPY.recent.title}
        </Text>
        <Pressable
          onPress={onSeeAll}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={HOME_COPY.recent.seeAll}
          className="min-h-[44px] justify-center px-1"
        >
          <Text className="text-sm font-medium text-primary">
            {HOME_COPY.recent.seeAll}
          </Text>
        </Pressable>
      </View>

      <View className="gap-3">
        {items.map((item) => (
          <RecentCalculationCard
            key={item.id}
            item={item}
            onPress={onItemPress ? () => onItemPress(item) : onSeeAll}
          />
        ))}
      </View>
    </View>
  );
}
