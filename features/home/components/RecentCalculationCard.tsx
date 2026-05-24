import { Text, View } from 'react-native';

import { Badge, Card } from '@/components/ui';
import { HOME_COPY } from '@/constants';
import type { HistoryItem } from '@/types';
import { formatCurrency, formatRelativeDate } from '@/utils';

interface RecentCalculationCardProps {
  item: HistoryItem;
  onPress?: () => void;
}

export function RecentCalculationCard({ item, onPress }: RecentCalculationCardProps) {
  const badgeLabel =
    item.status === 'sent' ? HOME_COPY.recent.badgeSent : HOME_COPY.recent.badgeDraft;
  const badgeVariant = item.status === 'sent' ? 'success' : 'default';

  return (
    <Card
      variant="outlined"
      onPress={onPress}
<<<<<<< HEAD:mobile/features/home/components/RecentCalculationCard.tsx
      className="active:border-primary/50"
=======
>>>>>>> 066b9274ae9ab4cd8513a16eb933b545f1194f3a:features/home/components/RecentCalculationCard.tsx
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${formatCurrency(item.value)}`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <View className="flex-row flex-wrap items-center gap-2 mb-1">
            <Text className="text-base font-medium text-foreground" numberOfLines={1}>
              {item.name}
            </Text>
            <Badge variant={badgeVariant} size="sm" label={badgeLabel} />
          </View>
          <Text className="text-sm text-muted-foreground">
            {formatRelativeDate(item.createdAt)}
          </Text>
        </View>
        <Text className="text-lg font-semibold text-foreground">
          {formatCurrency(item.value)}
        </Text>
      </View>
    </Card>
  );
}
