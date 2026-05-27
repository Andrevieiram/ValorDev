import { Text, View } from 'react-native';
import { Card } from '@/components/ui';
import { HOME_COPY } from '@/constants';

export function HomeTipCard() {
  return (
    <Card
      variant="glass"
      className="border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10 mb-4"
    >
      <View className="flex-row items-start gap-3">
        {/* Ícone de destaque com badge bg azul */}
        <View className="w-8 h-8 rounded-lg bg-blue-500/15 dark:bg-blue-500/25 items-center justify-center shrink-0">
          <Text className="text-base">💡</Text>
        </View>

        <View className="flex-1">
          <Text
            className="text-[10px] tracking-widest text-blue-500 uppercase mb-1"
            style={{ fontFamily: 'Inter_700Bold' }}
          >
            Dica do Dia
          </Text>
          <Text
            className="text-sm text-foreground dark:text-slate-300 leading-relaxed"
            style={{ fontFamily: 'Inter_300Light' }}
          >
            {HOME_COPY.tipMessage}
          </Text>
        </View>
      </View>
    </Card>
  );
}
