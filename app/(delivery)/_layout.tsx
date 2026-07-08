import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';

export default function DeliveryLayout() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !profile || profile.role !== 'delivery')) {
      router.replace('/(auth)/login');
    }
  }, [user, profile, loading]);

  if (loading || !profile || profile.role !== 'delivery') {
    return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator size="large" color="#1e3a8a" /></View>;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}