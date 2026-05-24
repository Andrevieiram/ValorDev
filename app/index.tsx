import { Redirect } from 'expo-router';

import { ROUTES } from '@/constants';

export default function Index() {
<<<<<<< HEAD:mobile/app/index.tsx
  return <Redirect href={ROUTES.home} />;
=======
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
>>>>>>> 066b9274ae9ab4cd8513a16eb933b545f1194f3a:app/index.tsx
}
