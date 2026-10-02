import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HelpScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#212529" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aide & Assistance</Text>
      </View>

      {/* Corps du message */}
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Feather name="user-x" size={50} color="#d9534f" />
        </View>
        <Text style={styles.title}>Aucun conseiller disponible</Text>
        <Text style={styles.subtitle}>
          Nos équipes de support pour la Côte d'Ivoire 🇨🇮, le Sénégal 🇸🇳, le Bénin 🇧🇯 et le Togo 🇹🇬 sont actuellement hors ligne.
        </Text>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>⏰ Horaires d'assistance :</Text>
          <Text style={styles.infoSub}>Du Lundi au Vendredi • 8h00 - 18h00 (GMT)</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#dee2e6', paddingTop: 40, gap: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  iconCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#fdeaea', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#212529', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6c757d', textAlign: 'center', lineHeight: 22 },
  infoBox: { marginTop: 30, backgroundColor: '#fff', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#e9ecef', width: '100%', alignItems: 'center' },
  infoText: { fontSize: 14, fontWeight: 'bold', color: '#212529' },
  infoSub: { fontSize: 13, color: '#7f8c8d', marginTop: 4 }
});
