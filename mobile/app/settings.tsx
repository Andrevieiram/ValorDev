import { Text, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Card } from '@/components/ui';

export default function SettingsScreen() {
  return (
    <ScreenContainer scrollable>
      <Text className="text-muted-foreground mb-6">
        Placeholder — moeda, tema e notificações na próxima fase.
      </Text>

      <Card variant="outlined">
        <Text className="text-sm text-foreground font-medium mb-1">Moeda</Text>
        <Text className="text-sm text-muted-foreground">BRL (padrão)</Text>
      </Card>
    </ScreenContainer>
  );
}
