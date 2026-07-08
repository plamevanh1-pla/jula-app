import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';

export default function SellerAnalyticsScreen() {
  const [revenue, setRevenue] = useState(0);
  const [deliveredCount, setDeliveredCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchFinancialStats();
  }, []);

  const fetchFinancialStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Récupérer uniquement les commandes livrées avec succès
      const { data, error } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'livré');

      if (error) throw error;

      // Calculer le chiffre d'affaires cumulé
      const totalRevenue = (data || []).reduce((sum, order) => sum + Number(order.total_amount), 0);
      
      setRevenue(totalRevenue);
      setDeliveredCount((data || []).length);
    } catch (error: any) {
      console.error("Erreur statistiques financières Jula:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Objectif mensuel fixé arbitrairement à 500 000 FCFA pour la démo visuelle
  const monthlyGoal = 500000;
  const progressPercentage = Math.min((revenue / monthlyGoal) * 100, 100);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f57c00" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>⬅ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analyses Financières</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Résumé des revenus principaux */}
        <View style={styles.revenueCard}>
          <Text style={styles.revenueLabel}>Chiffre d'affaires total encaissé</Text>
          <Text style={styles.revenueAmount}>{revenue.toLocaleString()} FCFA</Text>
          <Text style={styles.deliveredSubText}>Basé sur {deliveredCount} commande(s) livrée(s)</Text>
        </View>

        {/* Barre de progression des objectifs (Graphique épuré) */}
        <Text style={styles.sectionTitle}>Objectif du mois (Ventes)</Text>
        <View style={styles.goalCard}>
          <View style={styles.goalHeaderRow}>
            <Text style={styles.goalText}>Progression globale</Text>
            <Text style={styles.goalText}>{progressPercentage.toFixed(0)}%</Text>
          </View>
          
          {/* Conteneur de la barre */}
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
          </View>
          
          <Text style={styles.goalFooterText}>Objectif minimum : {monthlyGoal.toLocaleString()} FCFA</Text>
        </View>

        {/* Conseils de performance style Jumia Vendor */}
        <Text style={styles.sectionTitle}>Conseils Jula pour vendre plus</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Optimisez vos images de produits</Text>
          <Text style={styles.tipDescription}>Les articles possédant des images claires et lumineuses ont 3 fois plus de chances d'attirer les clients acheteurs.</Text>
        </View>

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>⚡ Rapidité de livraison</Text>
          <Text style={styles.tipDescription}>Modifiez le statut de vos colis dès qu'ils sont prêts pour accélérer la prise en charge par notre réseau logistique.</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#dee2e6' },
  backButton: { padding: 4 },
  backText: { fontSize: 15, color: '#f57c00', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  content: { padding: 24 },
  revenueCard: { backgroundColor: '#f57c00', padding: 24, borderRadius: 12, alignItems: 'center', marginBottom: 24, elevation: 2 },
  revenueLabel: { color: '#ffe0b2', fontSize: 13, fontWeight: '500' },
  revenueAmount: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginVertical: 6 },
  deliveredSubText: { color: '#fff', fontSize: 12, opacity: 0.9 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#495057', marginTop: 12, marginBottom: 12 },
  goalCard: { backgroundColor: '#fff', padding: 20, borderRadius: 8, borderWidth: 1, borderColor: '#dee2e6', marginBottom: 20 },
  goalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  goalText: { fontSize: 14, color: '#212529', fontWeight: '500' },
  progressBarBackground: { height: 12, backgroundColor: '#e9ecef', borderRadius: 6, overflow: 'hidden', marginBottom: 10 },
  progressBarFill: { height: '100%', backgroundColor: '#2e7d32' },
  goalFooterText: { fontSize: 12, color: '#6c757d', textAlign: 'right' },
  tipCard: { backgroundColor: '#fff', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#dee2e6', marginBottom: 12 },
  tipTitle: { fontSize: 14, fontWeight: 'bold', color: '#212529', marginBottom: 4 },
  tipDescription: { fontSize: 13, color: '#495057', lineHeight: 18 }
});