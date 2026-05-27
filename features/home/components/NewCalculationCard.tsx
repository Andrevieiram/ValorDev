import { LinearGradient } from 'expo-linear-gradient';
import { Plus, TrendingUp } from 'lucide-react-native';
import { Text, View, Pressable } from 'react-native';

import { Button } from '@/components/ui';
import { HOME_COPY } from '@/constants';

interface NewCalculationCardProps {
  onPress: () => void;
}

export function NewCalculationCard({ onPress }: NewCalculationCardProps) {
  return (
    <View
      className="mb-8 overflow-hidden rounded-2xl"
      style={{
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.28,
        shadowRadius: 20,
        elevation: 10,
      }}
    >
      {/* Gradiente blue → cyan (btn-glow do design system) */}
      <LinearGradient
        colors={['#2563eb', '#06b6d4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 24, borderRadius: 16 }}
      >
        {/* Badge de destaque */}
        <View className="flex-row items-center gap-1.5 mb-4 self-start">
          <View className="w-1.5 h-1.5 rounded-full bg-cyan-300 opacity-80" />
          <Text className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
            Nova Estimativa
          </Text>
        </View>

        <View className="flex-row items-start justify-between mb-5">
          <View className="flex-1 pr-4">
            <Text className="text-white/75 text-sm font-light mb-1">
              {HOME_COPY.hero.subtitle}
            </Text>
            <Text className="text-xl font-bold text-white leading-snug">
              {HOME_COPY.hero.title}
            </Text>
          </View>
          <TrendingUp color="rgba(255,255,255,0.5)" size={42} strokeWidth={1.5} />
        </View>

        {/* Botão branco com texto primary */}
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={HOME_COPY.hero.cta}
          className="w-full flex-row items-center justify-center rounded-xl bg-white/95 py-3.5 px-6 min-h-[50px] active:bg-white/80 active:scale-[0.98] transition-all"
          style={({ pressed }) => ({
            backgroundColor: pressed ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.95)',
            transform: [{ scale: pressed ? 0.98 : 1 }]
          })}
        >
          <View className="flex-row items-center justify-center gap-2">
            <Plus color="#2563eb" size={20} strokeWidth={2.5} />
            <Text style={{ color: '#2563eb', fontFamily: 'Inter_700Bold', fontSize: 16 }}>
              {HOME_COPY.hero.cta}
            </Text>
          </View>
        </Pressable>
      </LinearGradient>
    </View>
  );
}
