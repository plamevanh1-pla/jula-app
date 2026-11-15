import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Clipboard, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';

export default function PaymentScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const [selectedMethod, setSelectedMethod] = useState<'cash' | 'wave'>('cash');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Numéro Wave officiel Jula intégré
  const NUMERO_WAVE_JULA = '+2250706073717';

  // Palette dynamique (Clair / Sombre)
  const themeColors = {
    bgMain: isDarkMode ? '#111417' : '#f4f6f9',
    bgCard: isDarkMode ? '#1a1d21' : '#ffffff',
    bgActive: isDarkMode ? 'rgba(245, 124, 0, 0.15)' : '#fff3e0',
    bgWaveBox: isDarkMode ? 'rgba(29, 196, 240, 0.12)' : '#e0f7fa',
    bgNumberPill: isDarkMode ? '#111417' : '#f8f9fa',
    textMain: isDarkMode ? '#ffffff' : '#212529',
    textSub: isDarkMode ? '#adb5bd' : '#6c757d',
    border: isDarkMode ? '#2d3139' : '#dee2e6',
  };

  // Copie le numéro dans le téléphone du client en un clic
  const copierNumeroWave = () => {
    Clipboard.setString(NUMERO_WAVE_JULA);
    setCopied(true);
    Alert.alert('✅ Numéro copié !', `Le numéro ${NUMERO_WAVE_JULA} est copié. Vous pouvez le coller directement dans Wave.`);
    setTimeout(() => setCopied(false), 3000);
  };

  // Ouvre directement l'application Wave installée sur le téléphone
  const ouvrirApplicationWave = async () => {
    try {
      const waveAppUrl = 'wave://';
      const canOpen = await Linking.canOpenURL(waveAppUrl);
      if (canOpen) {
        await Linking.openURL(waveAppUrl);
      } else {
        await Linking.openURL('https://google.com');
      }
    } catch (error) {
      Alert.alert('Transfert Wave', `Ouvrez Wave et envoyez le montant au : ${NUMERO_WAVE_JULA}`);
    }
  };

  const confirmerCommande = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (selectedMethod === 'cash') {
        Alert.alert(
          '🎉 Commande validée !',
          'Votre commande est confirmée. Vous réglerez en espèces (FCFA) directement au livreur Jula à la réception.',
          [{ text: 'Retour à l’accueil', onPress: () => router.replace('/(client)/(tabs)/home') }]
        );
      } else {
        Alert.alert(
          '🌊 Commande enregistrée (Wave)',
          `N'oubliez pas d'effectuer le transfert Wave au ${NUMERO_WAVE_JULA}. Dès réception, votre colis est expédié !`,
          [
            { text: 'Ouvrir Wave maintenant', onPress: ouvrirApplicationWave },
            { text: 'Terminer', onPress: () => router.replace('/(client)/(tabs)/home') },
          ]
        );
      }
    }, 800);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.bgMain }]}>
      {/* Barre supérieure */}
      <View style={[styles.headerBar, { backgroundColor: themeColors.bgCard, borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={themeColors.textMain} />
        </TouchableOpacity>
        <Text style={[styles.headerBarTitle, { color: themeColors.textMain }]}>Finaliser le paiement</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: themeColors.textMain }]}>Choisissez votre mode de règlement</Text>
        <Text style={[styles.subtitle, { color: themeColors.textSub }]}>
          Transactions sécurisées en Francs CFA (Zone UEMOA)
        </Text>

        {/* OPTION 1 : PAIEMENT À LA LIVRAISON (CASH) */}
        <TouchableOpacity
          style={[
            styles.methodCard,
            { backgroundColor: themeColors.bgCard, borderColor: themeColors.border },
            selectedMethod === 'cash' && { borderColor: '#f57c00', backgroundColor: themeColors.bgActive },
          ]}
          onPress={() => setSelectedMethod('cash')}
        >
          <Text style={styles.icon}>💵</Text>
          <View style={styles.info}>
            <Text style={[styles.methodTitle, { color: themeColors.textMain }]}>Paiement à la livraison (Cash)</Text>
            <Text style={[styles.methodDesc, { color: themeColors.textSub }]}>
              Payez en espèces directement au livreur lorsque vous recevez votre colis.
            </Text>
          </View>
          <View style={[styles.radio, { borderColor: themeColors.border }, selectedMethod === 'cash' && styles.radioActive]} />
        </TouchableOpacity>

        {/* OPTION 2 : WAVE / MOBILE MONEY */}
        <TouchableOpacity
          style={[
            styles.methodCard,
            { backgroundColor: themeColors.bgCard, borderColor: themeColors.border },
            selectedMethod === 'wave' && { borderColor: '#1dc4f0', backgroundColor: themeColors.bgWaveBox },
          ]}
          onPress={() => setSelectedMethod('wave')}
        >
          <Text style={styles.icon}>🌊</Text>
          <View style={styles.info}>
            <Text style={[styles.methodTitle, { color: themeColors.textMain }]}>Payer avec Wave</Text>
            <Text style={[styles.methodDesc, { color: themeColors.textSub }]}>
              Copiez notre numéro Wave, ouvrez l'application et effectuez le transfert.
            </Text>
          </View>
          <View style={[styles.radio, { borderColor: themeColors.border }, selectedMethod === 'wave' && styles.radioWave]} />
        </TouchableOpacity>

        {/* ENCART D'ACTION DIRECTE WAVE AVEC BOUTON COPIER */}
        {selectedMethod === 'wave' && (
          <View style={[styles.waveActionBox, { backgroundColor: themeColors.bgCard, borderColor: '#1dc4f0' }]}>
            <Text style={[styles.waveInfoTitle, { color: themeColors.textMain }]}>
              📲 Numéro Wave Jula :
            </Text>

            {/* Ligne Numéro + Bouton Copier */}
            <View style={[styles.numberRow, { backgroundColor: themeColors.bgNumberPill, borderColor: themeColors.border }]}>
              <Text style={styles.waveNumber}>{NUMERO_WAVE_JULA}</Text>
              <TouchableOpacity
                style={[styles.copyBtn, copied && { backgroundColor: '#2e7d32' }]}
                onPress={copierNumeroWave}
              >
                <Feather name={copied ? 'check' : 'copy'} size={15} color="#fff" />
                <Text style={styles.copyBtnText}>{copied ? 'Copié' : 'Copier'}</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.waveInstruction, { color: themeColors.textSub }]}>
              1. Cliquez sur « Copier » pour enregistrer le numéro.{"\n"}
              2. Ouvrez Wave pour envoyer le montant exact.{"\n"}
              3. Revenez ici et cliquez sur « Confirmer ma commande ».
            </Text>

            <TouchableOpacity style={styles.openWaveBtn} onPress={ouvrirApplicationWave}>
              <Feather name="external-link" size={18} color="#fff" />
              <Text style={styles.openWaveBtnText}>Ouvrir l'application Wave</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bouton de validation finale */}
        <TouchableOpacity style={styles.confirmBtn} onPress={confirmerCommande} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmBtnText}>Confirmer ma commande</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, paddingTop: 40, gap: 12 },
  backButton: { padding: 2 },
  headerBarTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  title: { fontSize: 19, fontWeight: 'bold', marginBottom: 6, marginTop: 10 },
  subtitle: { fontSize: 13, marginBottom: 24 },
  methodCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 10, borderWidth: 1, marginBottom: 14 },
  icon: { fontSize: 26, marginRight: 14 },
  info: { flex: 1, paddingRight: 8 },
  methodTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  methodDesc: { fontSize: 12, lineHeight: 17 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2 },
  radioActive: { borderColor: '#f57c00', backgroundColor: '#f57c00' },
  radioWave: { borderColor: '#1dc4f0', backgroundColor: '#1dc4f0' },
  waveActionBox: { padding: 16, borderRadius: 10, borderWidth: 1.5, marginTop: 4, marginBottom: 10 },
  waveInfoTitle: { fontSize: 13, fontWeight: '600', marginBottom: 10, textAlign: 'center' },
  numberRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, borderWidth: 1, marginBottom: 12 },
  waveNumber: { fontSize: 17, fontWeight: '900', color: '#1dc4f0', letterSpacing: 0.5 },
  copyBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f57c00', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, gap: 6 },
  copyBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  waveInstruction: { fontSize: 12, lineHeight: 19, marginBottom: 14 },
  openWaveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1dc4f0', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, width: '100%', gap: 8 },
  openWaveBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  confirmBtn: { backgroundColor: '#f57c00', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 22, elevation: 2 },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
