import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

import { ROUTES } from '@/constants';

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Stack.Screen options={{ title: 'Página não encontrada' }} />
      <Text className="text-xl font-semibold text-foreground mb-4">
        Esta tela não existe.
      </Text>
      <Link href={ROUTES.home}>
        <Text className="text-primary font-medium">Ir para Home</Text>
      </Link>
    </View>
  );
}
