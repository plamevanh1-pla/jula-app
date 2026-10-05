  import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';

export default function AdminDashboardScreen() {
  const [globalStats, setGlobalStats] = useState({ totalUsers: 0, totalOrders: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🟢 CORRIGÉ : La fonction est déclarée AVANT d'être appelée ou référencée
  const fetchGlobalStats = async () => {
    try {
      if (!supabase) return;
      
      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      const { count: ordersCount, error: ordersError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      if (usersError || ordersError) throw usersError || ordersError;

      setGlobalStats({
        totalUsers: usersCount || 0,
        totalOrders: ordersCount || 0
      });
    } catch (error: any) {
      console.error("Erreur statistiques admin:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const globalStatsRef = { current: fetchGlobalStats };

  useEffect(() => {
    fetchGlobalStats();
  }, []);

  const handleLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f57c00" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerBarTitle}>DASHBOARD GÉNÉRAL</Text>
          <Text style={styles.headerBarSubtitle}>Vue d'ensemble de l'écosystème</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Feather name="power" size={20} color="#d9534f" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.welcomeText}>Indicateurs globaux d'activité Jula Network :</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statsCard}>
            <Feather name="users" size={22} color="#f57c00" />
            <Text style={styles.statsNumber}>{globalStats.totalUsers}</Text>
            <Text style={styles.statsLabel}>Membres inscrits</Text>
          </View>

          <View style={[styles.statsCard, { borderBottomColor: '#1072ba' }]}>
            <Feather name="package" size={22} color="#1072ba" />
            <Text style={[styles.statsNumber, { color: '#1072ba' }]}>{globalStats.totalOrders}</Text>
            <Text style={styles.statsLabel}>Commandes totales</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Gestion du système Jula</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(client)/users')}>
            <Feather name="user-check" size={18} color="#2e7d32" />
            <Text style={styles.actionText}>Modérer les utilisateurs & vendeurs</Text>
            <Feather name="chevron-right" size={16} color="#7f8c8d" style={styles.arrowRight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(client)/products')}>
            <Feather name="box" size={18} color="#f57c00" />
            <Text style={styles.actionText}>Inspecter le catalogue de produits</Text>
            <Feather name="chevron-right" size={16} color="#7f8c8d" style={styles.arrowRight} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(client)/admin-orders')}>
            <Feather name="activity" size={18} color="#1072ba" />
            <Text style={styles.actionText}>Historique global des transactions</Text>
            <Feather name="chevron-right" size={16} color="#7f8c8d" style={styles.arrowRight} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.buttonClose} onPress={() => router.back()}>
          <Text style={styles.buttonText}>🔒 Quitter le Dashboard</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111417' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111417' },
  headerBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1d21', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#2d3139', paddingTop: 40 },
  backButton: { padding: 2 },
  headerBarTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', letterSpacing: 0.5 },
  headerBarSubtitle: { fontSize: 11, color: '#f57c00', fontWeight: '600', marginTop: 2 },
  logoutBtn: { padding: 4 },
  scrollContainer: { padding: 15 },
  welcomeText: { fontSize: 13, color: '#ecf0f1', marginBottom: 20, fontWeight: '500' },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 25 },
  statsCard: { flex: 1, backgroundColor: '#1a1d21', padding: 16, borderRadius: 8, alignItems: 'center', borderBottomWidth: 4, borderBottomColor: '#f57c00', borderWidth: 1, borderColor: '#2d3139' },
  statsNumber: { fontSize: 22, fontWeight: 'bold', color: '#f57c00', marginTop: 8 },
  statsLabel: { fontSize: 11, color: '#95a5a6', marginTop: 4, textAlign: 'center', fontWeight: '500' },
  sectionTitle: { fontSize: 12, color: '#7f8c8d', fontWeight: 'bold', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 0.8 },
  actionsContainer: { gap: 10 },
  actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1d21', padding: 16, borderRadius: 4, borderWidth: 1, borderColor: '#2d3139' },
  actionText: { color: '#ecf0f1', fontSize: 13, fontWeight: '500', marginLeft: 14 },
  arrowRight: { marginLeft: 'auto' },
  buttonClose: { backgroundColor: '#f57c00', padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 30 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});
