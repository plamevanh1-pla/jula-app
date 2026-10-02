 import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function VouchersScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#212529" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Bons d'Achat</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Feather name="gift" size={45} color="#1072ba" />
        </View>
        <Text style={styles.title}>Aucun bon disponible</Text>
        <Text style={styles.subtitle}>
          Vous n'avez pas de coupon ou de bon d'achat actif pour le moment sur votre compte Jula Zone CFA.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#dee2e6', paddingTop: 40, gap: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  iconCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#e3f2fd', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 19, fontWeight: 'bold', color: '#212529', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6c757d', textAlign: 'center', lineHeight: 22 }
});
