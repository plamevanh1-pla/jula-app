  import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';

export default function PaymentSettingsScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  // Par défaut, on active le Paiement à la livraison qui fonctionne sans papiers bancaires
  const [selectedMethod, setSelectedMethod] = useState('Cash');

  // Palette dynamique (Clair / Sombre)
  const themeColors = {
    bgMain: isDarkMode ? '#111417' : '#f4f6f9',
    bgCard: isDarkMode ? '#1a1d21' : '#ffffff',
    bgActive: isDarkMode ? 'rgba(245, 124, 0, 0.15)' : '#fff3e0',
    textMain: isDarkMode ? '#ffffff' : '#212529',
    textSub: isDarkMode ? '#adb5bd' : '#7f8c8d',
    border: isDarkMode ? '#2d3139' : '#dee2e6',
    securityBg: isDarkMode ? 'rgba(46, 125, 50, 0.15)' : '#e8f5e9',
    btnClose: isDarkMode ? '#f57c00' : '#212529',
  };

  const confirmerPreference = (methode: string, label: string) => {
    setSelectedMethod(methode);
    Alert.alert('✅ Moyen de paiement activé', `Votre préférence est réglée sur : ${label}.`);
  };

  const associerNouvelleCarte = () => {
    Alert.alert(
      '💳 Carte Bancaire (Bientôt)',
      'Les paiements par carte Visa et Mastercard seront activés prochainement. Utilisez le Paiement à la livraison ou Mobile Money en attendant.'
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.bgMain }]}>
      {/* Barre d'en-tête */}
      <View style={[styles.headerBar, { backgroundColor: themeColors.bgCard, borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={themeColors.textMain} />
        </TouchableOpacity>
        <Text style={[styles.headerBarTitle, { color: themeColors.textMain }]}>Paramètres de paiement</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Moyens de paiement actifs (Zone UEMOA)</Text>

        {/* OPTION 1 : PAIEMENT À LA LIVRAISON (ACTIF IMMÉDIATEMENT SANS PAPIERS) */}
        <TouchableOpacity
          style={[
            styles.paymentCard,
            { backgroundColor: themeColors.bgCard, borderColor: themeColors.border },
            selectedMethod === 'Cash' && { borderColor: '#f57c00', backgroundColor: themeColors.bgActive },
          ]}
          onPress={() => confirmerPreference('Cash', 'Paiement en espèces à la livraison')}
        >
          <Text style={styles.cardIcon}>💵</Text>
          <View style={styles.textBlock}>
            <Text style={[styles.cardTitle, { color: themeColors.textMain }]}>Paiement à la livraison (Actif)</Text>
            <Text style={[styles.cardDescription, { color: themeColors.textSub }]}>
              Payez en espèces (Francs CFA) directement au livreur Jula lors de la réception de votre colis.
            </Text>
          </View>
          <View style={[styles.radio, { borderColor: themeColors.border }, selectedMethod === 'Cash' && styles.radioChecked]} />
        </TouchableOpacity>

        {/* OPTION 2 : MOBILE MONEY DIRECT */}
        <TouchableOpacity
          style={[
            styles.paymentCard,
            { backgroundColor: themeColors.bgCard, borderColor: themeColors.border },
            selectedMethod === 'Mobile Money' && { borderColor: '#f57c00', backgroundColor: themeColors.bgActive },
          ]}
          onPress={() => confirmerPreference('Mobile Money', 'Mobile Money (Wave, Orange, MTN, Moov)')}
        >
          <Text style={styles.cardIcon}>📲</Text>
          <View style={styles.textBlock}>
            <Text style={[styles.cardTitle, { color: themeColors.textMain }]}>Mobile Money (Actif)</Text>
            <Text style={[styles.cardDescription, { color: themeColors.textSub }]}>
              Règlement rapide via Wave, Orange Money, MTN ou Moov Africa dans les 7 pays.
            </Text>
          </View>
          <View style={[styles.radio, { borderColor: themeColors.border }, selectedMethod === 'Mobile Money' && styles.radioChecked]} />
        </TouchableOpacity>

        {/* OPTION 3 : CARTE BANCAIRE (EN ATTENTE D'AGRÉMENT) */}
        <TouchableOpacity
          style={[
            styles.paymentCard,
            { backgroundColor: themeColors.bgCard, borderColor: themeColors.border, opacity: 0.7 },
          ]}
          onPress={associerNouvelleCarte}
        >
          <Text style={styles.cardIcon}>💳</Text>
          <View style={styles.textBlock}>
            <Text style={[styles.cardTitle, { color: themeColors.textMain }]}>Carte Bancaire (Bientôt disponible)</Text>
            <Text style={[styles.cardDescription, { color: themeColors.textSub }]}>
              Visa ou Mastercard (En cours de déploiement régional).
            </Text>
          </View>
          <View style={[styles.radio, { borderColor: themeColors.border }]} />
        </TouchableOpacity>

        {/* NOTE DE SÉCURITÉ */}
        <View style={[styles.securityBox, { backgroundColor: themeColors.securityBg }]}>
          <Text style={styles.securityText}>
            🔒 Vos transactions sont protégées. Avec le paiement à la livraison ou Mobile Money, vous ne payez qu'en toute confiance lors du traitement de votre commande.
          </Text>
        </View>

        {/* Bouton retour */}
        <TouchableOpacity style={[styles.buttonClose, { backgroundColor: themeColors.btnClose }]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>← Retourner au Profil</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, paddingTop: 40, gap: 12 },
  backButton: { padding: 2 },
  headerBarTitle: { fontSize: 18, fontWeight: 'bold' },
  scrollContainer: { padding: 15 },
  sectionLabel: { fontSize: 12, color: '#7f8c8d', fontWeight: 'bold', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  paymentCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, padding: 16, marginBottom: 12, borderWidth: 1, elevation: 1 },
  cardIcon: { fontSize: 24, marginRight: 15 },
  textBlock: { flex: 1, paddingRight: 8 },
  cardTitle: { fontSize: 14, fontWeight: 'bold' },
  cardDescription: { fontSize: 12, marginTop: 3, lineHeight: 16 },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2 },
  radioChecked: { borderColor: '#f57c00', backgroundColor: '#f57c00' },
  securityBox: { padding: 15, borderRadius: 8, borderLeftWidth: 4, borderLeftColor: '#2e7d32', marginTop: 10, marginBottom: 15 },
  securityText: { fontSize: 11, color: '#2e7d32', lineHeight: 16, textAlign: 'justify' },
  buttonClose: { padding: 13, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});
