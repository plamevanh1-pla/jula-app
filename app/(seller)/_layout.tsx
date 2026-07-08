import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';

export default function SellerLayout() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Si l'utilisateur s'est déconnecté volontairement, on le renvoie simplement à l'accueil de connexion
      if (!user) {
        router.replace('/login');
        return;
      }
      
      // Si un profil existe mais qu'il n'est pas vendeur, on le redirige proprement
      if (profile && profile.role !== 'seller') {
        router.replace('/home');
      }
    }
  }, [user, profile, loading]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f57c00" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }
});