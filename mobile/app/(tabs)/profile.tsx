import { useRouter } from 'expo-router';
import { ChevronRight, Settings } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Card } from '@/components/ui';
import { ROUTES } from '@/constants';
import { colors } from '@/theme';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <ScreenContainer withTabBar>
      <Text className="text-2xl font-semibold text-foreground mb-6">Perfil</Text>

      <Card variant="outlined">
        <Pressable
          onPress={() => router.push(ROUTES.settings)}
          className="flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-3">
            <Settings color={colors.foreground} size={22} />
            <Text className="text-base font-medium text-foreground">
              Configurações
            </Text>
          </View>
          <ChevronRight color={colors.mutedForeground} size={20} />
        </Pressable>
      </Card>
    </ScreenContainer>
  );
}
