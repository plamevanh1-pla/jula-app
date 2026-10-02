import Feather from '@expo/vector-icons/Feather';
import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { supabase } from '../../../src/config/supabaseClient';

export default function TabsLayout() {

  // 📡 MONITEUR DE SÉCURITÉ JULA
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log("🔒 Session Jula active pour :", session.user.email);
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
        tabBarActiveTintColor: '#f57c00',    // Orange Jula pour l'onglet actif (comme "Compte" sur ta photo)
        tabBarInactiveTintColor: '#212529',  // Noir/Gris foncé pour les onglets inactifs
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          paddingBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#dee2e6',
          height: 65,
          paddingTop: 8,
        },
      }}
    >
      {/* Onglet 1 : Accueil */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={22} color={color} />
          ),
        }}
      />

      {/* Onglet 2 : Catégories */}
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Catégories',
          tabBarIcon: ({ color }) => (
            <Feather name="list" size={22} color={color} />
          ),
        }}
      />
      {/* Onglet 3 : Panier */}
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Panier',
          tabBarIcon: ({ color }) => (
            <Feather name="shopping-cart" size={22} color={color} />
          ),
        }}
      />

      {/* Onglet 4 : Favoris */}
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favoris',
          tabBarIcon: ({ color }) => (
            <Feather name="heart" size={22} color={color} />
          ),
        }}
      />

       <Tabs.Screen
  name="account"
  options={{
    title: 'Compte',
    tabBarIcon: ({ color }) => (
      <Feather name="user" size={22} color={color} />
    ),
  }}
/>

    </Tabs>
  );
}