import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../src/config/supabaseClient';

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('orders').select('*').order('created_at', { ascending: false }).then(({ data }) => {
      setOrders(data || []);
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#f57c00" />
        </TouchableOpacity>
        <Text style={styles.title}>Mes Commandes</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>Vous n'avez pas encore passé de commande.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.idText}>Commande #{item.id}</Text>
            <Text style={styles.dateText}>Méthode : {item.payment_method || 'Mobile Money'}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeTxt}>{item.status || 'En attente'}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#dee2e6', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: '#dee2e6' },
  idText: { fontSize: 15, fontWeight: 'bold', color: '#212529' },
  dateText: { fontSize: 13, color: '#6c757d', marginTop: 4 },
  badge: { backgroundColor: '#fff3e0', alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 4, marginTop: 8 },
  badgeTxt: { color: '#e65100', fontSize: 12, fontWeight: '600', textTransform: 'uppercase' },
  empty: { textAlign: 'center', color: '#6c757d', marginTop: 40 }
});