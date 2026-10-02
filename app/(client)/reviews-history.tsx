  import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ReviewsHistoryScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#212529" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notes & Avis</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Feather name="edit-3" size={45} color="#2e7d32" />
        </View>
        <Text style={styles.title}>Aucun avis en attente</Text>
        <Text style={styles.subtitle}>
          Après avoir reçu ton colis au Sénégal, en Côte d'Ivoire, au Togo ou au Bénin, tu pourras noter ton grossiste ici !
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
  iconCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#e8f5e9', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#212529', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#6c757d', textAlign: 'center', lineHeight: 20 }
});
