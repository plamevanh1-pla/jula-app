 import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ConsultesRecemmentScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#212529" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Consultés Récemment</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Feather name="clock" size={45} color="#6c757d" />
        </View>
        <Text style={styles.title}>Votre historique est vide</Text>
        <Text style={styles.subtitle}>
          Les smartphones, tablettes et articles électroniques que vous visitez sur Jula s'afficheront ici automatiquement.
        </Text>
        
        <TouchableOpacity style={styles.btnAction} onPress={() => router.replace('/home')}>
          <Text style={styles.btnText}>Parcourir le Catalogue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#dee2e6', paddingTop: 40, gap: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  iconCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#e9ecef', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 19, fontWeight: 'bold', color: '#212529', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6c757d', textAlign: 'center', lineHeight: 22, marginBottom: 25 },
  btnAction: { backgroundColor: '#212529', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});
