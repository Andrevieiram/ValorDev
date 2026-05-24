import { Text, View } from 'react-native';

import { HOME_COPY } from '@/constants';

interface HomeHeaderProps {
  userName: string;
}

export function HomeHeader({ userName }: HomeHeaderProps) {
  return (
    <View className="mb-8">
      <Text className="text-base text-muted-foreground mb-1">{HOME_COPY.greeting}</Text>
      <Text className="text-3xl font-semibold text-foreground tracking-tight">
        {userName} 👋
      </Text>
    </View>
  );
}
