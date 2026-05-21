import { Text, View } from 'react-native';
import { HOME_COPY } from '@/constants';
import { useTheme } from '@/theme';

interface HomeHeaderProps {
  userName: string;
}

export function HomeHeader({ userName }: HomeHeaderProps) {
  const { colors } = useTheme();

  return (
    <View className="mb-8">
      {/* Label de saudação — text-primary (azul) conforme design system */}
      <Text
        className="text-xs tracking-widest text-primary uppercase mb-1"
        style={{ fontFamily: 'Inter_700Bold' }}
      >
        {HOME_COPY.greeting}
      </Text>

      {/* Nome — foreground (preto/branco), não primary */}
      <Text
        className="text-3xl tracking-tight text-foreground"
        style={{ fontFamily: 'Inter_800ExtraBold' }}
      >
        {userName}
      </Text>

      <Text
        className="text-sm text-muted-foreground mt-1 leading-relaxed"
        style={{ fontFamily: 'Inter_300Light' }}
      >
        Veja suas estimativas recentes ou calcule um novo projeto.
      </Text>
    </View>
  );
}

