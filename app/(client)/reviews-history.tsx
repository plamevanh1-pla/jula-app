 import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';

export default function ReviewsHistoryScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f6f9', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 50, marginBottom: 10 }}>📝</Text>
      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Aucun avis en attente</Text>
      <Text style={{ fontSize: 12, color: '#777', textAlign: 'center', marginTop: 5, marginBottom: 20 }}>Retrouvez ici l'historique des notes laissées aux grossistes après vos livraisons.</Text>
      <TouchableOpacity style={{ backgroundColor: '#f57c00', padding: 12, borderRadius: 6 }} onPress={() => router.back()}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Retour</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}