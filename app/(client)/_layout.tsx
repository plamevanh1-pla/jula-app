import { Stack } from 'expo-router';
import React from 'react';

export default function ClientLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 1. Le groupe d'onglets (La barre orange du bas) */}
      <Stack.Screen name="(tabs)" /> 

      {/* 2. Les écrans de plein écran appelés depuis le profil ou le panier */}
      <Stack.Screen name="checkout" />
      <Stack.Screen name="checkout-address" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="wallet" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="favorites" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="ai-recommendations" />
      <Stack.Screen name="order-tracking" />
    </Stack>
  );
}