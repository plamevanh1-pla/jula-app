import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';

export default function SuperAdminScreen() {
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

  // Statistiques régionales Jula (Zone CFA)
  const [stats] = useState({
    totalGrossistes: 14,
    totalCommandes: 142,
    chiffreAffaires: 18450000,
    alertesLogistiques: 3
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.bgMain }]}>
      {/* En-tête du Quartier Général */}
      <View style={[styles.headerBar, { backgroundColor: themeColors.bgCard, borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={themeColors.textMain} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.headerBarTitle, { color: themeColors.textMain }]}>QG MOBILE JACKY</Text>
          <Text style={styles.headerBarSubtitle}>Console de Contrôle Globale Jula</Text>
        </View>
        <Feather name="shield" size={24} color="#f57c00" />
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>📈 Tableau de Bord Zone CFA (XOF)</Text>
        
        <View style={styles.statsGrid}>
          <TouchableOpacity 
            style={[styles.statsCard, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]} 
            onPress={() => router.push('/(client)/users')}
          >
            <Feather name="users" size={20} color="#f57c00" />
            <Text style={styles.statsNumber}>{stats.totalGrossistes}</Text>
            <Text style={[styles.statsTitle, { color: themeColors.textMuted }]}>Grossistes Certifiés</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statsCard, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border, borderBottomColor: '#1072ba' }]} 
            onPress={() => router.push('/(client)/admin-orders')}
          >
            <Feather name="package" size={20} color="#1072ba" />
            <Text style={[styles.statsNumber, { color: '#1072ba' }]}>{stats.totalCommandes}</Text>
            <Text style={[styles.statsTitle, { color: themeColors.textMuted }]}>Flux de Commandes</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.statsCard, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border, borderBottomColor: '#2e7d32', width: '100%' }]} 
            onPress={() => router.push('/(client)/analytics')}
          >
            <Feather name="trending-up" size={20} color="#2e7d32" />
            <Text style={[styles.statsNumber, { color: '#2e7d32' }]}>{stats.chiffreAffaires.toLocaleString('fr-FR')} F</Text>
            <Text style={[styles.statsTitle, { color: themeColors.textMuted }]}>Volume d'Affaires Global (7 Pays UEMOA)</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>⚙️ Pilotage Stratégique du Réseau</Text>

        <TouchableOpacity 
          style={[styles.adminActionRow, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]} 
          onPress={() => router.push('/(client)/dashboard')}
        >
          <View style={styles.actionLeft}>
            <Feather name="grid" size={18} color={themeColors.textMain} />
            <Text style={[styles.actionText, { color: themeColors.textMain }]}>Ouvrir le Dashboard Général</Text>
          </View>
          <Feather name="chevron-right" size={16} color="#7f8c8d" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.adminActionRow, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]} 
          onPress={() => router.push('/(client)/products')}
        >
          <View style={styles.actionLeft}>
            <Feather name="box" size={18} color="#f57c00" />
            <Text style={[styles.actionText, { color: themeColors.textMain }]}>Gestion du Catalogue Produits</Text>
          </View>
          <Feather name="chevron-right" size={16} color="#7f8c8d" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.adminActionRow, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]} 
          onPress={() => router.push('/(client)/users')}
        >
          <View style={styles.actionLeft}>
            <Feather name="user-check" size={18} color="#2e7d32" />
            <Text style={[styles.actionText, { color: themeColors.textMain }]}>Utilisateurs & Boutiques</Text>
          </View>
          <Feather name="chevron-right" size={16} color="#7f8c8d" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.adminActionRow, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]} 
          onPress={() => router.push('/(client)/admin-orders')}
        >
          <View style={styles.actionLeft}>
            <Feather name="alert-triangle" size={18} color="#d9534f" />
            <Text style={[styles.actionText, { color: themeColors.textMain }]}>Litiges & Alertes Logistiques</Text>
          </View>
          <View style={styles.badgeAlerte}>
            <Text style={styles.badgeAlerteText}>{stats.alertesLogistiques}</Text>
          </View>
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
  container: { flex: 1 },
  headerBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, paddingTop: 40 },
  backButton: { padding: 2 },
  headerBarTitle: { fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
  headerBarSubtitle: { fontSize: 11, color: '#f57c00', fontWeight: '600', marginTop: 2 },
  scrollContainer: { padding: 15 },
  sectionLabel: { fontSize: 11, color: '#7f8c8d', fontWeight: 'bold', marginBottom: 12, marginTop: 15, textTransform: 'uppercase', letterSpacing: 0.8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 10 },
  statsCard: { width: '48%', borderRadius: 8, padding: 14, borderBottomWidth: 4, borderBottomColor: '#f57c00', borderWidth: 1 },
  statsNumber: { fontSize: 18, fontWeight: 'bold', color: '#f57c00', marginVertical: 6 },
  statsTitle: { fontSize: 11, fontWeight: '500' },
  adminActionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 6, marginBottom: 10, borderWidth: 1 },
  actionLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  actionText: { fontSize: 13, fontWeight: '500' },
  badgeAlerte: { backgroundColor: '#d9534f', width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  badgeAlerteText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  buttonClose: { backgroundColor: '#f57c00', padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 25 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});
