 import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';

export default function WalletScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const soldeVirtuel = 25000; // Exemple de solde en FCFA

  // Palette dynamique (Clair / Sombre)
  const themeColors = {
    bgMain: isDarkMode ? '#111417' : '#f8f9fa',
    bgCard: isDarkMode ? '#1a1d21' : '#ffffff',
    walletCardBg: isDarkMode ? '#1e2229' : '#212529',
    textMain: isDarkMode ? '#ffffff' : '#212529',
    textSub: isDarkMode ? '#adb5bd' : '#495057',
    border: isDarkMode ? '#2d3139' : '#dee2e6',
    divider: isDarkMode ? '#2d3139' : '#f1f3f5',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.bgMain }]}>
      {/* En-tête de page complète */}
      <View style={[styles.header, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={themeColors.textMain} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textMain }]}>Mon Jula Wallet</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Carte de crédit virtuelle */}
        <View style={[styles.walletCard, { backgroundColor: themeColors.walletCardBg, borderColor: themeColors.border, borderWidth: isDarkMode ? 1 : 0 }]}>
          <Text style={styles.walletLabel}>Solde disponible (Zone UEMOA)</Text>
          <Text style={styles.walletBalance}>{soldeVirtuel.toLocaleString('fr-FR')} FCFA</Text>
          <Text style={styles.walletId}>ID Compte : JU-98231</Text>
        </View>

        <TouchableOpacity 
          style={styles.rechargeButton}
          onPress={() => Alert.alert("Rechargement Mobile Money", "Choisissez Wave, Orange Money, MTN ou Moov pour créditer votre compte en FCFA.")}
        >
          <Text style={styles.rechargeText}>💳 Recharger mon portefeuille</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, { color: themeColors.textSub }]}>Historique des transactions</Text>
        <View style={[styles.transactionList, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]}>
          <View style={[styles.transactionItem, { borderBottomColor: themeColors.divider }]}>
            <Text style={[styles.transName, { color: themeColors.textMain }]}>Achat Commande #0921</Text>
            <Text style={[styles.transAmount, { color: '#dc3545' }]}>- 18 500 FCFA</Text>
          </View>
          <View style={[styles.transactionItem, { borderBottomWidth: 0 }]}>
            <Text style={[styles.transName, { color: themeColors.textMain }]}>Recharge via Wave</Text>
            <Text style={[styles.transAmount, { color: '#2e7d32' }]}>+ 30 000 FCFA</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, paddingTop: 40 },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 24 },
  walletCard: { padding: 24, borderRadius: 16, marginBottom: 24 },
  walletLabel: { color: '#adb5bd', fontSize: 13 },
  walletBalance: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginVertical: 8 },
  walletId: { color: '#9ca3af', fontSize: 12, marginTop: 8 },
  rechargeButton: { backgroundColor: '#f57c00', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 32 },
  rechargeText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 12 },
  transactionList: { borderRadius: 8, overflow: 'hidden', borderWidth: 1 },
  transactionItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1 },
  transName: { fontSize: 14 },
  transAmount: { fontSize: 14, fontWeight: 'bold' }
});
