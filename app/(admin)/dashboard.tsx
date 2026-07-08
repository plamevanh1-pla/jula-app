import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';

export default function AdminDashboardScreen() {
  const [globalStats, setGlobalStats] = useState({ totalUsers: 0, totalOrders: 0 });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchGlobalStats();
  }, []);

  const fetchGlobalStats = async () => {
    try {
      // Nombre total d'utilisateurs inscrits sur Jula
      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Nombre total de commandes enregistrées globalement
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#343a40" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête Admin */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Panneau Administrateur</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Quitter</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.welcomeText}>Vue globale de l'écosystème Jula :</Text>

        {/* Statistiques Plateforme */}
        <View style={styles.statsGrid}>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>{globalStats.totalUsers}</Text>
            <Text style={styles.statsLabel}>Membres inscrits</Text>
          </View>

          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>{globalStats.totalOrders}</Text>
            <Text style={styles.statsLabel}>Commandes totales</Text>
          </View>
        </View>

        {/* Menus de modération */}
        <Text style={styles.sectionTitle}>Gestion du système</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(admin)/users')}>
            <Text style={styles.actionText}>👥 Modérer les utilisateurs & vendeurs</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(admin)/products')}>
            <Text style={styles.actionText}>📦 Inspecter le catalogue de produits</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(admin)/orders')}>
            <Text style={styles.actionText}>📊 Historique global des transactions</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#212529', borderBottomWidth: 1, borderColor: '#343a40' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  logoutText: { color: '#ffc107', fontWeight: '600', fontSize: 14 },
  content: { padding: 24 },
  welcomeText: { fontSize: 15, color: '#495057', marginBottom: 20, fontWeight: '500' },
  statsGrid: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  statsCard: { flex: 1, backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#dee2e6' },
  statsNumber: { fontSize: 24, fontWeight: 'bold', color: '#212529' },
  statsLabel: { fontSize: 12, color: '#6c757d', marginTop: 4, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#212529', marginBottom: 16 },
  actionsContainer: { gap: 12 },
  actionButton: { backgroundColor: '#fff', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#ced4da' },
  actionText: { color: '#212529', fontSize: 15, fontWeight: '600' }
});