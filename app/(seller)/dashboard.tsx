import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SellerDashboard() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(client)/(tabs)/profile')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Espace Vendeur Jula</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.txt}>🏬 Formulaire de publication prêt pour la Zone CFA !</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f6' },
  header: { backgroundColor: '#1072ba', padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 40 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  txt: { fontSize: 15, fontWeight: 'bold', color: '#212529', textAlign: 'center' }
});
