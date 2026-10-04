import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Écran de connexion principal */}
      <Stack.Screen name="login" />

      {/* Écran d'inscription pour les nouveaux utilisateurs */}
      <Stack.Screen name="register" />
    </Stack>
  );
}
