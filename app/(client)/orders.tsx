import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OrdersScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#212529" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Commandes</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Feather name="package" size={45} color="#f57c00" />
        </View>
        <Text style={styles.title}>Vous n'avez pas de commande</Text>
        <Text style={styles.subtitle}>
          Vos achats de smartphones, tablettes ou articles électroniques en direct des grossistes s'afficheront ici avec leur suivi de livraison !
        </Text>
        <TouchableOpacity style={styles.btnAction} onPress={() => router.replace('/(client)/(tabs)/home')}>
          <Text style={styles.btnText}>Commencer mes achats</Text>
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
  iconCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#fff3e0', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#212529', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#6c757d', textAlign: 'center', lineHeight: 20, marginBottom: 25 },
  btnAction: { backgroundColor: '#f57c00', paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});
