 import { Stack, useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { CartProvider } from '../src/context/CartContext';

// Interface optionnelle pour l'historique des segments de navigation
type RouteSegment = string;

function NavigationGuard() {
  const { user, loading, role } = useAuth();
  const router = useRouter();
  const segments = useSegments() as RouteSegment[];

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments.includes('(auth)');
    const inSellerGroup = segments.includes('(seller)');
    const inAdminGroup = segments.includes('(admin)');
    const inDeliveryGroup = segments.includes('(delivery)');
    const currentRoute = segments[segments.length - 1];

    // 🛑 CAS 1 : Connecté et sur un écran Auth (Login/Register)
    if (user && inAuthGroup) {
      if (role === 'seller') return router.replace('/(seller)/dashboard');
      if (role === 'admin') return router.replace('/(admin)/dashboard');
      if (role === 'delivery') return router.replace('/(delivery)/home');
      
      return router.replace('/(client)/(tabs)/home');
    }

    // 🛑 CAS 2 : Non connecté tente d'accéder aux espaces pro
    if (!user) {
      if (inSellerGroup || inAdminGroup || inDeliveryGroup) {
        return router.replace('/(auth)/login');
      }
    }

    // 🛑 CAS 3 : Pages clients sécurisées style Jumia
    const secureClientPages = ['profile', 'checkout', 'orders'];
    if (!user && secureClientPages.includes(currentRoute)) {
      return router.replace('/(auth)/login');
    }

  }, [user, loading, role, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#f57c00" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(client)" />
      <Stack.Screen name="(seller)" />
      <Stack.Screen name="(admin)" />
      <Stack.Screen name="(delivery)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationGuard />
      </CartProvider>
    </AuthProvider>
  );
}