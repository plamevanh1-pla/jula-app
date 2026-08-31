import { Stack } from 'expo-router';
import React from 'react';

export default function AdminLayout() {
  // 🔓 OUVERTURE TOTALE : On supprime le blocage du rôle pour ouvrir ton écran direct !
  return <Stack screenOptions={{ headerShown: false }} />;
}

 