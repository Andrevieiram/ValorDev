import { Text } from 'react-native';

import { Card } from '@/components/ui';
import { HOME_COPY } from '@/constants';

export function HomeTipCard() {
  return (
    <Card variant="default" className="bg-info-light border-info/20">
      <Text className="text-sm leading-5 text-info">
        💡 {HOME_COPY.tipMessage}
      </Text>
    </Card>
  );
}
