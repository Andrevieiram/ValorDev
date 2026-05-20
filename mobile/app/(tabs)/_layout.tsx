import { Tabs } from 'expo-router';
import { Clock, Home, User } from 'lucide-react-native';

import { TAB_BAR_INNER_HEIGHT } from '@/constants/layout';
import { useTabBarMetrics } from '@/hooks';
import { colors } from '@/theme';

export default function TabLayout() {
  const { tabBarStyle } = useTabBarMetrics();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle,
        tabBarItemStyle: {
          height: TAB_BAR_INNER_HEIGHT,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color, size }) => <Clock color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
