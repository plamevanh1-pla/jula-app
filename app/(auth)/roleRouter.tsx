import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';

export default function RoleRouter() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    // Récupération du rôle stocké dans le profil ou dans les métadonnées natives du compte
    const userRole = profile?.role || user?.user_metadata?.role || 'client';

    console.log("Rôle détecté pour l'aiguillage Jula :", userRole);

    // Aiguillage précis selon le rôle
    switch (userRole) {
      case 'admin':
        router.replace('/(admin)/dashboard');
        break;
      case 'seller':
        router.replace('/(seller)/dashboard');
        break;
      case 'delivery':
        router.replace('/(delivery)/dashboard');
        break;
      case 'client':
      default:
        router.replace('/home');
        break;
    }
  }, [user, profile, loading]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#f57c00" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }
});