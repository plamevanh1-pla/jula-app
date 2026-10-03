 import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SuperAdminScreen() {
  const router = useRouter();

  // 📈 STATISTIQUES REGIONALES JULA DE PRODUCTION (ZONE CFA)
  const [stats] = useState({
    totalGrossistes: 14,
    totalCommandes: 142,
    chiffreAffaires: 18450000,
    alertesLogistiques: 3
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔍 EN-TÊTE PREMIUM DU QUARTIER GÉNÉRAL JACKY */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerBarTitle}>QG MOBILE JACKY</Text>
          <Text style={styles.headerBarSubtitle}>Console de Contrôle Globale Jula</Text>
        </View>
        <Feather name="shield" size={24} color="#f57c00" />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>📈 Tableau de Bord Zone CFA (XOF)</Text>
        
        <View style={styles.statsGrid}>
          <TouchableOpacity style={styles.statsCard} onPress={() => router.push('/(admin)/users')}>
            <Feather name="users" size={20} color="#f57c00" />
            <Text style={styles.statsNumber}>{stats.totalGrossistes}</Text>
            <Text style={styles.statsTitle}>Grossistes Certifiés</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.statsCard, { borderBottomColor: '#1072ba' }]} onPress={() => router.push('/(admin)/orders')}>
            <Feather name="package" size={20} color="#1072ba" />
            <Text style={[styles.statsNumber, { color: '#1072ba' }]}>{stats.totalCommandes}</Text>
            <Text style={styles.statsTitle}>Flux de Commandes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.statsCard, { borderBottomColor: '#2e7d32', width: '100%' }]} onPress={() => router.push('/(admin)/analytics')}>
            <Feather name="trending-up" size={20} color="#2e7d32" />
            <Text style={[styles.statsNumber, { color: '#2e7d32' }]}>{stats.chiffreAffaires.toLocaleString('fr-FR')} F</Text>
            <Text style={styles.statsTitle}>Volume d'Affaires Global (UEMOA)</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionLabel}>⚙️ Pilotage Stratégique du Réseau</Text>

        <TouchableOpacity style={styles.adminActionRow} onPress={() => router.push('/(admin)/dashboard')}>
          <View style={styles.actionLeft}>
            <Feather name="grid" size={18} color="#fff" />
            <Text style={styles.actionText}>Ouvrir le Dashboard Général</Text>
          </View>
          <Feather name="chevron-right" size={16} color="#7f8c8d" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.adminActionRow} onPress={() => router.push('/(admin)/products')}>
          <View style={styles.actionLeft}>
            <Feather name="box" size={18} color="#f57c00" />
            <Text style={styles.actionText}>Gestion du Catalogue Produits</Text>
          </View>
          <Feather name="chevron-right" size={16} color="#7f8c8d" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.adminActionRow} onPress={() => router.push('/(admin)/users')}>
          <View style={styles.actionLeft}>
            <Feather name="user-check" size={18} color="#2e7d32" />
            <Text style={styles.actionText}>Utilisateurs & Boutiques</Text>
          </View>
          <Feather name="chevron-right" size={16} color="#7f8c8d" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.adminActionRow, { borderBottomWidth: 0 }]} onPress={() => router.push('/(admin)/orders')}>
          <View style={styles.actionLeft}>
            <Feather name="alert-triangle" size={18} color="#d9534f" />
            <Text style={styles.actionText}>Litiges & Alertes Logistiques</Text>
          </View>
          <View style={styles.badgeAlerte}><Text style={styles.badgeAlerteText}>{stats.alertesLogistiques}</Text></View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonClose} onPress={() => router.back()}>
          <Text style={styles.buttonText}>🔒 Verrouiller la Console et Quitter</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111417' },
  headerBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1d21', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#2d3139', paddingTop: 40 },
  backButton: { padding: 2 },
  headerBarTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', letterSpacing: 0.5 },
  headerBarSubtitle: { fontSize: 11, color: '#f57c00', fontWeight: '600', marginTop: 2 },
  scrollContainer: { padding: 15 },
  sectionLabel: { fontSize: 11, color: '#7f8c8d', fontWeight: 'bold', marginBottom: 12, marginTop: 15, textTransform: 'uppercase', letterSpacing: 0.8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 10 },
  statsCard: { width: '48%', backgroundColor: '#1a1d21', borderRadius: 8, padding: 14, borderBottomWidth: 4, borderBottomColor: '#f57c00', borderWidth: 1, borderColor: '#2d3139' },
  statsNumber: { fontSize: 18, fontWeight: 'bold', color: '#f57c00', marginVertical: 6 },
  statsTitle: { fontSize: 11, color: '#95a5a6', fontWeight: '500' },
  adminActionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1a1d21', padding: 16, borderBottomWidth: 1, borderColor: '#2d3139', borderRadius: 4, marginBottom: 10, borderWidth: 1 },
  actionLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  actionText: { fontSize: 13, color: '#ecf0f1', fontWeight: '500' },
  badgeAlerte: { backgroundColor: '#d9534f', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  badgeAlerteText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  buttonClose: { backgroundColor: '#f57c00', padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 25 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});
