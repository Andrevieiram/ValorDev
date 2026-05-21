import React from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/constants';
import { View, ActivityIndicator } from 'react-native';

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
    return <Redirect href={ROUTES.home} />;
  }

  return <Redirect href="/auth" />;
}
