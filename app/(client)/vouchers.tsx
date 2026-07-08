import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function VouchersScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(client)/(tabs)/profile')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Bons d'achat</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        {/* On affiche un faux bon d'achat de bienvenue pour animer l'écran proprement */}
        <View style={styles.voucherCard}>
          <View style={styles.leftCutout} />
          <View style={styles.rightCutout} />
          <View style={styles.voucherBody}>
            <Text style={styles.voucherTitle}>🎉 Cadeau de Bienvenue Jula</Text>
            <Text style={styles.voucherValue}>2 500 FCFA</Text>
            <Text style={styles.voucherSub}>Valable sur tout le réseau 4 Pays</Text>
            <Text style={styles.voucherCode}>CODE : JULAFRIQUE2026</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  header: { backgroundColor: '#f57c00', padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 40 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  voucherCard: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#e9ecef', position: 'relative', overflow: 'hidden', padding: 20 },
  leftCutout: { position: 'absolute', left: -10, top: '45%', width: 20, height: 20, borderRadius: 10, backgroundColor: '#f2f2f2', borderWidth: 1, borderColor: '#e9ecef' },
  rightCutout: { position: 'absolute', right: -10, top: '45%', width: 20, height: 20, borderRadius: 10, backgroundColor: '#f2f2f2', borderWidth: 1, borderColor: '#e9ecef' },
  voucherBody: { alignItems: 'center' },
  voucherTitle: { fontSize: 14, fontWeight: 'bold', color: '#212529' },
  voucherValue: { fontSize: 26, fontWeight: 'bold', color: '#f57c00', marginVertical: 8 },
  voucherSub: { fontSize: 12, color: '#7f8c8d' },
  voucherCode: { fontSize: 11, fontWeight: 'bold', color: '#1072ba', marginTop: 10, backgroundColor: '#e6f2fa', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, overflow: 'hidden' }
});
