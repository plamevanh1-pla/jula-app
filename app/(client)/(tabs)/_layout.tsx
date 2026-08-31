import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Text } from 'react-native';
// 🟢 IMPORTATION DU COMPOSANT CENTRAL DE SÉCURITÉ SUPABASE
import { supabase } from '../../../src/config/supabaseClient';

export default function TabsLayout() {

  // 📡 MONITEUR DE SÉCURITÉ JULA : VERROUILLE L'UTILISATEUR CONNECTÉ DANS LE TÉLÉPHONE
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log("🔒 Session Jula active et verrouillée pour :", session.user.email);
      } else if (event === 'SIGNED_OUT' || !session) {
        console.log("👤 Mode Invité / Déconnecté");
      }
    });

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#f57c00',    // Orange Jula quand l'onglet est sélectionné
        tabBarInactiveTintColor: '#6c757d',  // Gris quand l'onglet n'est pas sélectionné
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#dee2e6',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      {/* Onglet 1 : Accueil */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '🏠' : '🏠'}</Text>
          ),
        }}
      />

      {/* Onglet 2 : Catégories */}
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Catégories',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '📂' : '📁'}</Text>
          ),
        }}
      />

      {/* Onglet 3 : Panier */}
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Panier',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '🛒' : '🛒'}</Text>
          ),
        }}
      />

      {/* Onglet 4 : Profil */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 20 }}>{focused ? '👤' : '👤'}</Text>
          ),
        }}
      />
    </Tabs>
  );
}