import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function NotificationsScreen() {
  const router = useRouter();

  const ALERTS = [
    { id: '1', title: '🚀 Promo Flash Jula !', body: 'Jusqu’à -50% sur la catégorie Électronique aujourd’hui seulement.', time: 'Il y a 10 min' },
    { id: '2', title: '📦 Colis en route', body: 'Le livreur Jula a récupéré votre commande et se dirige vers votre quartier.', time: 'Il y a 2 heures' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>⬅ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Notifications</Text>
        <View style={{ width: 60 }} />
      </View>

      <FlatList
        data={ALERTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <Text style={styles.alertTitle}>{item.title}</Text>
              <Text style={styles.alertTime}>{item.time}</Text>
            </View>
            <Text style={styles.alertBody}>{item.body}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#dee2e6' },
  backButton: { padding: 4 },
  backText: { fontSize: 15, color: '#f57c00', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  alertCard: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#f57c00', elevation: 1 },
  alertHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  alertTitle: { fontSize: 15, fontWeight: 'bold', color: '#212529' },
  alertTime: { fontSize: 11, color: '#adb5bd' },
  alertBody: { fontSize: 13, color: '#495057', lineHeight: 18 }
});