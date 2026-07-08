import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';

export default function AdminAnalyticsScreen() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchGlobalFinancials();
  }, []);

  const fetchGlobalFinancials = async () => {
    try {
      // Récupérer toutes les commandes pour faire les calculs globaux
      const { data, error } = await supabase
        .from('orders')
        .select('total_amount, status');

      if (error) throw error;

      let revenueSum = 0;
      let completedCount = 0;
      let pendingCount = 0;

      (data || []).forEach(order => {
        if (order.status === 'livré') {
          revenueSum += Number(order.total_amount);
          completedCount++;
        } else if (order.status === 'en_attente' || order.status === 'en_cours') {
          pendingCount++;
        }
      });

      setTotalRevenue(revenueSum);
      setCompletedOrders(completedCount);
      setPendingOrders(pendingCount);
    } catch (error: any) {
      console.error("Erreur analyses admin Jula:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête Sombre Admin */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>⬅ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rapports Globaux</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#212529" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          {/* Carte du Chiffre d'Affaires Global de la Plateforme */}
          <View style={styles.mainCard}>
            <Text style={styles.mainLabel}>Volume d'affaires global (GMV)</Text>
            <Text style={styles.mainAmount}>{totalRevenue.toLocaleString()} FCFA</Text>
            <Text style={styles.mainSubText}>Cumul des transactions finalisées</Text>
          </View>

          <Text style={styles.sectionTitle}>État des flux logistiques</Text>

          {/* Grille des indicateurs opérationnels */}
          <View style={styles.grid}>
            <View style={styles.statsBox}>
              <Text style={[styles.statsNumber, { color: '#2e7d32' }]}>{completedOrders}</Text>
              <Text style={styles.statsLabel}>Livraisons réussies</Text>
            </View>

            <View style={styles.statsBox}>
              <Text style={[styles.statsNumber, { color: '#ef6c00' }]}>{pendingOrders}</Text>
              <Text style={styles.statsLabel}>Commandes actives</Text>
            </View>
          </View>

          {/* Analyse des commissions style Jumia Office */}
          <Text style={styles.sectionTitle}>Revenus Jula App (Estimation)</Text>
          <View style={styles.commissionCard}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Frais de service (Commissions 5%)</Text>
              <Text style={styles.rowValue}>{(totalRevenue * 0.05).toLocaleString()} FCFA</Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.footerNote}>ℹ️ Ces revenus sont calculés automatiquement sur la base des ventes déclarées comme livrées par le réseau.</Text>
          </View>

        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#212529', borderBottomWidth: 1, borderColor: '#343a40' },
  backButton: { padding: 4 },
  backText: { fontSize: 15, color: '#fff', fontWeight: '500' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  content: { padding: 24 },
  mainCard: { backgroundColor: '#212529', padding: 24, borderRadius: 12, alignItems: 'center', marginBottom: 24 },
  mainLabel: { color: '#9bc2e6', fontSize: 13, fontWeight: '500' },
  mainAmount: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginVertical: 6 },
  mainSubText: { color: '#6c757d', fontSize: 12 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#495057', marginTop: 12, marginBottom: 12 },
  grid: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  statsBox: { flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#dee2e6' },
  statsNumber: { fontSize: 24, fontWeight: 'bold' },
  statsLabel: { fontSize: 12, color: '#6c757d', marginTop: 4, textAlign: 'center' },
  commissionCard: { backgroundColor: '#fff', padding: 20, borderRadius: 8, borderWidth: 1, borderColor: '#dee2e6' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { fontSize: 14, color: '#212529', fontWeight: '500' },
  rowValue: { fontSize: 16, fontWeight: 'bold', color: '#2e7d32' },
  divider: { height: 1, backgroundColor: '#dee2e6', marginVertical: 12 },
  footerNote: { fontSize: 11, color: '#6c757d', lineHeight: 16 }
});