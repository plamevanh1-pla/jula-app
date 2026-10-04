  import { Stack } from 'expo-router';
import React from 'react';

export default function ClientLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 1. Le groupe d'onglets principal Jula (La barre du bas) */}
      <Stack.Screen name="(tabs)" /> 

      {/* 2. Les écrans de plein écran de l'écosystème Jula */}
      <Stack.Screen name="checkout" />
      <Stack.Screen name="checkout-address" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="wallet" />
      <Stack.Screen name="orders" /> {/* 👤 Gère l'écran "Mes Commandes" du Client */}
      <Stack.Screen name="notifications" />
      
      {/* 🟢 AJOUT DU MODULE DE SUIVI GLOBAL DU QG JACKY (SÉPARÉ POUR ÉVITER LES CONFLITS) */}
      <Stack.Screen name="admin-orders" /> {/* ⚙️ Gère le suivi global de l'Empire Jula */}
      
      {/* Les modules d'aide et services */}
      <Stack.Screen name="help" />
      <Stack.Screen name="services" />
      
      {/* Historique, Marchands et Coupons du QG Jacky replacés dans le dossier client */}
      <Stack.Screen name="superadmin" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="products" />
      <Stack.Screen name="users" />
      
      {/* Historique, Marchands et Coupons du profil */}
      <Stack.Screen name="vendeurs-suivis" />
      <Stack.Screen name="consultes-recemment" />
      <Stack.Screen name="vouchers" />
      <Stack.Screen name="reviews-history" />
      <Stack.Screen name="about" />
      
      {/* Profil et Paramètres secondaires */}
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="order-tracking" />
    </Stack>
  );
}
