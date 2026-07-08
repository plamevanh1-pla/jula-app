import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';

export default function DeliveriesScreen() {
  const [runs, setRuns] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    supabase.from('orders').select('*').eq('status', 'en_cours').then(({ data }) => setRuns(data || []));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <View style={{ padding: 16, backgroundColor: '#1e3a8a', flexDirection: 'row' }}>
        <TouchableOpacity onPress={() => router.back()}><Text style={{ color: '#fff' }}>⬅ Retour</Text></TouchableOpacity>
        <Text style={{ color: '#fff', marginLeft: 20, fontWeight: 'bold' }}>Feuille de route</Text>
      </View>
      <FlatList
        data={runs}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12 }} onPress={() => router.push(`/tracking/${item.id}`)}>
            <Text style={{ fontWeight: 'bold' }}>Colis #{item.id}</Text>
            <Text style={{ color: '#495057', marginTop: 4 }}>📍 Destination : {item.delivery_city}, {item.delivery_neighborhood}</Text>
            <Text style={{ color: '#1e3a8a', fontWeight: '600', marginTop: 8 }}>👉 Ouvrir pour mettre à jour</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}