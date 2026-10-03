 import { Stack } from 'expo-router';
import React from 'react';

export default function AdminLayout() {
  // 🔓 OUVERTURE ET SÉCURISATION DES ROUTES DU QG JACKY
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Écran d'accueil principal du QG Jacky */}
      <Stack.Screen name="superadmin" />

      {/* Les sous-modules de gestion de la zone CFA */}
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="products" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="users" />
    </Stack>
  );
}
