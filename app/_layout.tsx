import { Stack } from 'expo-router';
import React from 'react';
import { AuthProvider } from '../src/context/AuthContext';
import { CartProvider } from '../src/context/CartContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(client)" />
          <Stack.Screen name="(seller)" />
          <Stack.Screen name="(admin)" />
          <Stack.Screen name="(delivery)" />
        </Stack>
      </CartProvider>
    </AuthProvider>
  );
}