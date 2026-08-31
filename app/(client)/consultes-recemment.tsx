import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ConsultesRecemmentScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête officiel */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>Consultés récemment</Text>
      </View>

      {/* Écran d'attente Jumia-Style (Vide par défaut) */}
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>⏳</Text>
        <Text style={styles.emptyTitle}>Votre historique est vide</Text>
        <Text style={styles.emptySubtitle}>
          Les articles des grossistes que vous visitez s'afficheront ici automatiquement pour vous permettre de les retrouver en un clic.
        </Text>
        
        <TouchableOpacity style={styles.exploreButton} onPress={() => router.push('/')}>
          <Text style={styles.exploreButtonText}>Continuer mes achats</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  headerBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  backButton: { marginRight: 15 },
  backArrow: { fontSize: 22, color: '#333', fontWeight: 'bold' },
  headerBarTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 25 },
  emptyIcon: { fontSize: 60, marginBottom: 15 },
  emptyTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 8 },
  emptySubtitle: { fontSize: 12, color: '#777', textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  
  exploreButton: { backgroundColor: '#f57c00', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 6 },
  exploreButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 }
});
