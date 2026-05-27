import { Text, View } from 'react-native';

import { Card } from '@/components/ui';
import { HOME_COPY } from '@/constants';
import type { HistoryItem } from '@/types';
import { formatCurrency, formatRelativeDate } from '@/utils';

interface RecentCalculationCardProps {
  item: HistoryItem;
  onPress?: () => void;
}

const statusConfig = {
  sent: { label: 'Enviado', bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
  draft: { label: 'Rascunho', bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-500', dot: 'bg-slate-400' },
};

export function RecentCalculationCard({ item, onPress }: RecentCalculationCardProps) {
  const status = statusConfig[item.status as keyof typeof statusConfig] ?? statusConfig.draft;

  return (
    <Card
      variant="glass"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.name}, ${formatCurrency(item.value)}`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          {/* Nome do projeto */}
          <Text className="text-base font-semibold text-foreground dark:text-white mb-1" numberOfLines={1}>
            {item.name}
          </Text>

          {/* Data relativa */}
          <Text className="text-xs text-muted-foreground font-light">
            {formatRelativeDate(item.createdAt)}
          </Text>
        </View>

        <View className="items-end gap-1.5">
          {/* Valor — JetBrains Mono do design system */}
          <Text
            className="text-base font-bold text-foreground dark:text-white"
            style={{ fontFamily: 'JetBrainsMono_700Bold' }}
          >
            {formatCurrency(item.value)}
          </Text>

          {/* Badge com dot animado */}
          <View className={`flex-row items-center gap-1 px-2 py-0.5 rounded-full ${status.bg}`}>
            <View className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
            <Text className={`text-[10px] font-semibold ${status.text}`}>{status.label}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
}
