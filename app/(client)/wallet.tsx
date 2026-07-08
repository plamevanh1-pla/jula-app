// app/(client)/wallet.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WalletScreen() {
  const router = useRouter();
  const soldeVirtuel = 25000; // Exemple de solde en FCFA

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête de page complète */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>⬅ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon Jula Wallet</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Carte de crédit virtuelle */}
        <View style={styles.walletCard}>
          <Text style={styles.walletLabel}>Solde disponible</Text>
          <Text style={styles.walletBalance}>{soldeVirtuel.toLocaleString()} FCFA</Text>
          <Text style={styles.walletId}>ID Compte : JU-98231</Text>
        </View>

        <TouchableOpacity style={styles.rechargeButton}>
          <Text style={styles.rechargeText}>💳 Recharger mon portefeuille</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Historique des transactions</Text>
        <View style={styles.transactionList}>
          <View style={styles.transactionItem}>
            <Text style={styles.transName}>Achat Commande #0921</Text>
            <Text style={[styles.transAmount, { color: '#dc3545' }]}>- 18 500 FCFA</Text>
          </View>
          <View style={styles.transactionItem}>
            <Text style={styles.transName}>Recharge via Wave</Text>
            <Text style={[styles.transAmount, { color: '#2e7d32' }]}>+ 30 000 FCFA</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#dee2e6' },
  backButton: { padding: 4 },
  backText: { fontSize: 15, color: '#f57c00', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  content: { padding: 24 },
  walletCard: { backgroundColor: '#212529', padding: 24, borderRadius: 16, marginBottom: 24 },
  walletLabel: { color: '#adb5bd', fontSize: 13 },
  walletBalance: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginVertical: 8 },
  walletId: { color: '#6c757d', fontSize: 12, marginTop: 8 },
  rechargeButton: { backgroundColor: '#f57c00', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 32 },
  rechargeText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#495057', marginBottom: 12 },
  transactionList: { backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#dee2e6' },
  transactionItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f3f5' },
  transName: { fontSize: 14, color: '#212529' },
  transAmount: { fontSize: 14, fontWeight: 'bold' }
});