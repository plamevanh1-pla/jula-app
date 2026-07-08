import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OrderTrackingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}><Text style={styles.backText}>⬅ Retour</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Centre de Suivi Global</Text>
        <View style={{ width: 60 }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.text}>Pour suivre un colis en temps réel, veuillez vous rendre directement dans votre historique d'achats depuis l'onglet profil, puis cliquez sur la commande concernée.</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/(client)/orders')}>
          <Text style={styles.buttonText}>Aller à mes commandes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#dee2e6' },
  backButton: { padding: 4 }, backText: { fontSize: 15, color: '#f57c00', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  content: { padding: 24, alignItems: 'center' },
  text: { fontSize: 15, color: '#495057', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  button: { backgroundColor: '#f57c00', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});