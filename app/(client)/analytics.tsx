import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';
import { useTheme } from '../../src/context/ThemeContext';

export default function AdminAnalyticsScreen() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isDarkMode } = useTheme();

  // Palette dynamique (Clair / Sombre)
  const themeColors = {
    bgMain: isDarkMode ? '#111417' : '#f4f6f9',
    bgCard: isDarkMode ? '#1a1d21' : '#ffffff',
    textMain: isDarkMode ? '#ffffff' : '#212529',
    textSub: isDarkMode ? '#ecf0f1' : '#495057',
    textMuted: isDarkMode ? '#95a5a6' : '#6c757d',
    border: isDarkMode ? '#2d3139' : '#e0e0e0',
  };

  useEffect(() => {
    fetchGlobalFinancials();
  }, []);

  const fetchGlobalFinancials = async () => {
    try {
      if (!supabase) return;

      const { data, error } = await supabase
        .from('orders')
        .select('total_amount, status');

      if (error) throw error;

      let revenueSum = 0;
      let completedCount = 0;
      let pendingCount = 0;

      (data || []).forEach(order => {
        const currentStatus = order.status?.toLowerCase();
        if (currentStatus === 'livré' || currentStatus === 'livre') {
          revenueSum += Number(order.total_amount || 0);
          completedCount++;
        } else if (currentStatus === 'en_attente' || currentStatus === 'en_cours') {
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

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: themeColors.bgMain }]}>
        <ActivityIndicator size="large" color="#f57c00" />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.bgMain }]}>
      {/* Barre d'en-tête officielle du QG */}
      <View style={[styles.headerBar, { backgroundColor: themeColors.bgCard, borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={themeColors.textMain} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.headerBarTitle, { color: themeColors.textMain }]}>RAPPORTS FINANCIERS</Text>
          <Text style={styles.headerBarSubtitle}>Statistiques globales Zone CFA</Text>
        </View>
        <Feather name="trending-up" size={20} color="#2e7d32" />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Carte du Chiffre d'Affaires Global de la Plateforme (GMV) */}
        <View style={[styles.mainCard, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]}>
          <Text style={[styles.mainLabel, { color: themeColors.textMuted }]}>Volume d'affaires global (GMV)</Text>
          <Text style={[styles.mainAmount, { color: themeColors.textMain }]}>{totalRevenue.toLocaleString('fr-FR')} FCFA</Text>
          <Text style={styles.mainSubText}>Cumul des transactions de la zone UEMOA</Text>
        </View>

        <Text style={styles.sectionTitle}>État des flux logistiques</Text>

        {/* Grille des indicateurs opérationnels */}
        <View style={styles.grid}>
          <View style={[styles.statsBox, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]}>
            <Feather name="check-circle" size={20} color="#2e7d32" style={{ marginBottom: 4 }} />
            <Text style={[styles.statsNumber, { color: '#2e7d32' }]}>{completedOrders}</Text>
            <Text style={[styles.statsLabel, { color: themeColors.textMuted }]}>Livraisons réussies</Text>
          </View>

          <View style={[styles.statsBox, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border, borderBottomColor: '#f57c00' }]}>
            <Feather name="clock" size={20} color="#f57c00" style={{ marginBottom: 4 }} />
            <Text style={[styles.statsNumber, { color: '#f57c00' }]}>{pendingOrders}</Text>
            <Text style={[styles.statsLabel, { color: themeColors.textMuted }]}>Commandes actives</Text>
          </View>
        </View>

        {/* Analyse des commissions */}
        <Text style={styles.sectionTitle}>Revenus Jula App (Estimation)</Text>
        <View style={[styles.commissionCard, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]}>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: themeColors.textSub }]}>Frais de service (Commissions 5%)</Text>
            <Text style={styles.rowValue}>{(totalRevenue * 0.05).toLocaleString('fr-FR')} F</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: themeColors.border }]} />
          <Text style={styles.footerNote}>
            ℹ️ Ces revenus sont calculés automatiquement sur la base des ventes déclarées comme livrées par le réseau dans les 7 filiales de la zone UEMOA.
          </Text>
        </View>

        {/* Bouton fermeture sécurisée */}
        <TouchableOpacity style={styles.buttonClose} onPress={() => router.back()}>
          <Text style={styles.buttonText}>🔒 Quitter les Rapports</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, paddingTop: 40 },
  backButton: { padding: 2 },
  headerBarTitle: { fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
  headerBarSubtitle: { fontSize: 11, color: '#f57c00', fontWeight: '600', marginTop: 2 },
  scrollContainer: { padding: 15 },
  mainCard: { padding: 24, borderRadius: 8, alignItems: 'center', marginBottom: 25, borderWidth: 1, borderLeftWidth: 5, borderLeftColor: '#2e7d32' },
  mainLabel: { fontSize: 12, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5 },
  mainAmount: { fontSize: 24, fontWeight: 'bold', marginVertical: 8 },
  mainSubText: { color: '#7f8c8d', fontSize: 11 },
  sectionTitle: { fontSize: 12, color: '#7f8c8d', fontWeight: 'bold', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 0.8 },
  grid: { flexDirection: 'row', gap: 12, marginBottom: 25 },
  statsBox: { flex: 1, padding: 16, borderRadius: 8, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#2e7d32', borderWidth: 1 },
  statsNumber: { fontSize: 22, fontWeight: 'bold' },
  statsLabel: { fontSize: 11, marginTop: 4, textAlign: 'center', fontWeight: '500' },
  commissionCard: { padding: 16, borderRadius: 8, borderWidth: 1, borderLeftWidth: 5, borderLeftColor: '#1072ba' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { fontSize: 13, fontWeight: '500' },
  rowValue: { fontSize: 15, fontWeight: 'bold', color: '#2e7d32' },
  divider: { height: 1, marginVertical: 12 },
  footerNote: { fontSize: 11, color: '#7f8c8d', lineHeight: 16, textAlign: 'justify' },
  buttonClose: { backgroundColor: '#f57c00', padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 30 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});
