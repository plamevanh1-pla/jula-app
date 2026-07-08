import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function DeliveryDashboard() {
  const router = useRouter();
  const [delivered, setDelivered] = useState(false);

  const handleConfirmDelivery = () => {
    Alert.alert(
      "Confirmer la livraison",
      "Le colis est-il bien arrivé et sécurisé au Point Relais ?",
      [
        { text: "Non" },
        { 
          text: "Oui, valider", 
          onPress: () => {
            setDelivered(true);
            Alert.alert("Succès 🎉", "Statut mis à jour ! Notification envoyée au client et commission ajoutée.");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(client)/(tabs)/profile')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Espace Livreur & Logistique</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}><Text style={styles.statNum}>1</Text><Text style={styles.statLabel}>Course active</Text></View>
          <View style={styles.statCard}><Text style={[styles.statNum, {color:'#00a86b'}]}>{delivered ? '2500' : '0'} F</Text><Text style={styles.statLabel}>Gain du jour</Text></View>
        </View>

        <Text style={styles.sectionTitle}>📦 Colis à acheminer (Zone CFA)</Text>
        <View style={styles.taskCard}>
          <Text style={styles.taskTitle}>Colis N° JL-98327-RCI</Text>
          <Text style={styles.taskDesc}>📦 Contenu : Ordinateur portable HP ProBook</Text>
          <Text style={styles.taskDesc}>🏬 De : Magasin Vendeur Certifié</Text>
          <Text style={styles.taskDesc}>🏪 Vers : Point Relais Sélectionné</Text>
          
          {delivered ? (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#155724" />
              <Text style={styles.completedText}>Colis reçu au Point Relais</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.btnAction} onPress={handleConfirmDelivery}>
              <Text style={styles.btnActionText}>Marquer comme Livré (Sous 3j)</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f6' },
  header: { backgroundColor: '#212529', padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 40 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#e9ecef' },
  statNum: { fontSize: 20, fontWeight: 'bold', color: '#1072ba' },
  statLabel: { fontSize: 12, color: '#6c757d', marginTop: 4 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#212529', marginBottom: 12 },
  taskCard: { backgroundColor: '#fff', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#e9ecef' },
  taskTitle: { fontSize: 14, fontWeight: 'bold', color: '#212529', marginBottom: 8 },
  taskDesc: { fontSize: 12, color: '#495057', marginTop: 4 },
  btnAction: { backgroundColor: '#1072ba', padding: 12, borderRadius: 6, alignItems: 'center', marginTop: 15 },
  btnActionText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  completedBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#d4edda', padding: 12, borderRadius: 6, marginTop: 15, justifyContent: 'center' },
  completedText: { color: '#155724', fontWeight: 'bold', fontSize: 13 }
});
