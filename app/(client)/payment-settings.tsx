 import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// 🟢 IMPORTATION DE LA BIBLIOTHÈQUE VECTO MODERNE FEATHER
import Feather from '@expo/vector-icons/Feather';

export default function PaymentSettingsScreen() {
  const router = useRouter();

  // États de simulation pour de vrais utilisateurs (Wave, Mobile Money, Cartes)
  const [selectedMethod, setSelectedMethod] = useState('Mobile Money');

  const associerNouvelleCarte = () => {
    Alert.alert("💳 Sécurité Jula Pay", "La liaison cryptée de nouvelles cartes bancaires (Visa / Mastercard) sera activée dès la validation de votre dossier d'agrément régional auprès de la BCEAO.");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔍 BARRE D'EN-TÊTE CONFIGURÉE AVEC ICONE FEATHER ET MARGES ANDROID */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#212529" />
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>Paramètres de paiement</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Moyens de paiement enregistrés</Text>

        {/* RECOURS 1 : MOBILE MONEY (WAVE, ORANGE, MTN, MOOV) */}
        <TouchableOpacity 
          style={[styles.paymentCard, selectedMethod === 'Mobile Money' && styles.activeCard]} 
          onPress={() => setSelectedMethod('Mobile Money')}
        >
          <Text style={styles.cardIcon}>📲</Text>
          <View style={styles.textBlock}>
            <Text style={styles.cardTitle}>Portefeuille Mobile Money Unique</Text>
            <Text style={styles.cardDescription}>Achat direct via Wave, Orange Money, MTN ou Moov Africa.</Text>
          </View>
          <View style={[styles.radio, selectedMethod === 'Mobile Money' && styles.radioChecked]} />
        </TouchableOpacity>

        {/* RECOURS 2 : CARTE BANCAIRE */}
        <TouchableOpacity 
          style={[styles.paymentCard, selectedMethod === 'Carte' && styles.activeCard]} 
          onPress={() => setSelectedMethod('Carte')}
        >
          <Text style={styles.cardIcon}>💳</Text>
          <View style={styles.textBlock}>
            <Text style={styles.cardTitle}>Carte Bancaire Sécurisée</Text>
            <Text style={styles.cardDescription}>Visa ou Mastercard (Transactions cryptées SSL).</Text>
          </View>
          <View style={[styles.radio, selectedMethod === 'Carte' && styles.radioChecked]} />
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Actions bancaires</Text>

        {/* BOUTON D'AJOUT DE MOYEN DE PAIEMENT */}
        <TouchableOpacity style={styles.addButton} onPress={associerNouvelleCarte}>
          <Text style={styles.addButtonText}>+ Ajouter un moyen de paiement</Text>
        </TouchableOpacity>

        {/* NOTE DE SÉCURITÉ REGIONALE */}
        <View style={styles.securityBox}>
          <Text style={styles.securityText}>🔒 Vos informations financières sont entièrement chiffrées de bout en bout et gérées de manière conforme aux exigences bancaires de la BCEAO dans toute la zone UEMOA.</Text>
        </View>

        {/* Bouton retour */}
        <TouchableOpacity style={styles.buttonClose} onPress={() => router.back()}>
          <Text style={styles.buttonText}>← Retourner au Profil</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  headerBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#dee2e6', paddingTop: 40, gap: 12 },
  backButton: { padding: 2 },
  headerBarTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  
  scrollContainer: { padding: 15 },
  sectionLabel: { fontSize: 12, color: '#6c757d', fontWeight: 'bold', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  
  // Style des lignes de paiement
  paymentCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#dee2e6', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  activeCard: { borderColor: '#f57c00', backgroundColor: '#fff3e0' },
  cardIcon: { fontSize: 24, marginRight: 15 },
  textBlock: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#212529' },
  cardDescription: { fontSize: 12, color: '#7f8c8d', marginTop: 3, lineHeight: 16 },
  
  // Boutons radio personnalisés
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#dee2e6', backgroundColor: '#fff' },
  radioChecked: { borderColor: '#f57c00', backgroundColor: '#f57c00' },
  
  addButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#f57c00', padding: 13, borderRadius: 8, alignItems: 'center', marginVertical: 15 },
  addButtonText: { color: '#f57c00', fontWeight: 'bold', fontSize: 13 },
  
  securityBox: { backgroundColor: '#e8f5e9', padding: 15, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#2e7d32', marginBottom: 15 },
  securityText: { fontSize: 11, color: '#2e7d32', lineHeight: 16, textAlign: 'justify' },
  
  buttonClose: { backgroundColor: '#212529', padding: 13, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});
