import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';

export default function StoreDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Boutique Jula ID : {id}</Text>
      <TouchableOpacity style={{ marginTop: 16, backgroundColor: '#f57c00', padding: 12, borderRadius: 8 }} onPress={() => router.back()}>
        <Text style={{ color: '#fff' }}>Retour</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}