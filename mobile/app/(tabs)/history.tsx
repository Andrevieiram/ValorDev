import { Text, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { Card } from '@/components/ui';

export default function HistoryScreen() {
  return (
    <ScreenContainer withTabBar>
      <Text className="text-2xl font-semibold text-foreground mb-2">Histórico</Text>
      <Text className="text-muted-foreground mb-6">
        Placeholder — lista de propostas será implementada na próxima fase.
      </Text>

      <Card variant="outlined">
        <Text className="text-sm text-muted-foreground">
          Persistência preparada em{' '}
          <Text className="font-mono text-foreground">store/persistence.ts</Text>
        </Text>
      </Card>
    </ScreenContainer>
  );
}
