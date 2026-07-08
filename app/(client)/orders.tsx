import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OrdersScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(client)/(tabs)/profile')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Commandes & Colis</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        <View style={styles.orderCard}>
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>N° Colis : JL-98327-CFA</Text>
            <Text style={styles.statusBadge}>En cours de route 🚚</Text>
          </View>
          <Text style={styles.orderItem}>📦 1x Article Jula Certifié</Text>
          <Text style={styles.orderMeta}>📍 Destination : Point Relais sélectionné</Text>
          <Text style={styles.orderMeta}>⏱️ Arrivée prévue : Sous 3 jours maximum</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f6' },
  header: { backgroundColor: '#f57c00', padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 40 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  orderCard: { backgroundColor: '#fff', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#e9ecef', elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#f1f3f5', paddingBottom: 10, marginBottom: 10 },
  orderId: { fontSize: 13, fontWeight: 'bold', color: '#212529' },
  statusBadge: { backgroundColor: '#fff3cd', color: '#856404', fontSize: 11, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, fontWeight: 'bold', overflow: 'hidden' },
  orderItem: { fontSize: 14, fontWeight: 'bold', color: '#495057', marginBottom: 8 },
  orderMeta: { fontSize: 12, color: '#6c757d', marginTop: 4 }
});
