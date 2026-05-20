import { LinearGradient } from 'expo-linear-gradient';
import { Plus, TrendingUp } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui';
import { HOME_COPY } from '@/constants';
import { colors } from '@/theme';

interface NewCalculationCardProps {
  onPress: () => void;
}

export function NewCalculationCard({ onPress }: NewCalculationCardProps) {
  return (
    <View className="mb-8 overflow-hidden rounded-2xl">
      <LinearGradient
        colors={[colors.primary, '#1d4ed8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 24, borderRadius: 16 }}
      >
        <View className="flex-row items-start justify-between mb-4">
          <View className="flex-1 pr-4">
            <Text className="text-sm text-white/80 mb-2">
              {HOME_COPY.hero.subtitle}
            </Text>
            <Text className="text-xl font-semibold text-white">
              {HOME_COPY.hero.title}
            </Text>
          </View>
          <TrendingUp color="rgba(255,255,255,0.6)" size={40} strokeWidth={1.5} />
        </View>

        <Button
          variant="secondary"
          size="lg"
          className="w-full bg-white"
          textClassName="text-primary font-semibold"
          label={HOME_COPY.hero.cta}
          leftIcon={<Plus color={colors.primary} size={20} strokeWidth={2.5} />}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={HOME_COPY.hero.cta}
        />
      </LinearGradient>
    </View>
  );
}
