  import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppearanceSelector from '../../src/components/AppearanceSelector'; // 🟢 IMPORT DU SÉLECTEUR JULA

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Barre d'en-tête supérieure */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres Jula</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Contenu principal de la page */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Affichage & Thème</Text>
        {/* Sélecteur de mode Clair / Sombre de Jacky */}
        <AppearanceSelector />
        
        <Text style={styles.sectionTitle}>À propos</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>Version de l'application : v1.1.0</Text>
          <Text style={styles.infoText}>Réseau Logistique UEMOA</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 60, borderBottomWidth: 1, borderColor: '#e9ecef', backgroundColor: '#ffffff' },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backText: { fontSize: 20, fontWeight: 'bold', color: '#212529' },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#212529' },
  content: { padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#7f8c8d', marginTop: 20, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoCard: { padding: 16, backgroundColor: '#ffffff', borderRadius: 8, borderWidth: 1, borderColor: '#e9ecef' },
  infoText: { fontSize: 13.5, color: '#495057', marginBottom: 4 }
});
