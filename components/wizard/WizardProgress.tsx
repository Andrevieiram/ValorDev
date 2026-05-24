import { View, Text } from 'react-native';

interface WizardProgressProps {
  current: number;
  total?: number;
}

export function WizardProgress({ current, total = 5 }: WizardProgressProps) {
  return (
    <View className="px-4 pt-3 pb-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Passo {current} de {total}
        </Text>
        <View className="flex-row gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <View
              key={i}
              className={`h-1 flex-1 rounded-full ${
                i < current ? 'bg-primary' : 'bg-muted'
              }`}
              style={{ width: `${100 / total}%` }}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
