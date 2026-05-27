import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { ROUTES } from '@/constants';
import { useAuthStore } from '@/store';

export default function Index() {
  const { user, skipped, isHydrated } = useAuthStore();

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (user || skipped) {
    return <Redirect href={ROUTES.home as any} />;
  }

  return <Redirect href="/auth" />;
}
