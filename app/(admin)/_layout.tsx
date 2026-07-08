
import { Stack, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';

export default function AdminLayout() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si le chargement est fini et que l'utilisateur n'est pas admin, on le rejette
    if (!loading) {
      if (!user || !profile || profile.role !== 'admin') {
        Alert.alert("Accès refusé", "Vous n'avez pas l'autorisation d'accéder à cet espace.");
        router.replace('/(auth)/login');
      }
    }
  }, [user, profile, loading]);

  // Pendant la vérification du rôle, on affiche un écran de chargement
  if (loading || !profile || profile.role !== 'admin') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#212529" />
      </View>
    );
  }

  // Si tout est valide, on affiche les écrans du dossier admin
  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }
});