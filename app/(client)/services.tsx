import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Linking, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';

export default function ServicesScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  // Remplace par l'adresse exacte de ton site Render
  const URL_PORTAIL_VENDEUR = 'https://jula-web.onrender.com';

  // Palette dynamique (Clair / Sombre)
  const themeColors = {
    bgMain: isDarkMode ? '#111417' : '#f4f6f9',
    bgCard: isDarkMode ? '#1a1d21' : '#ffffff',
    textMain: isDarkMode ? '#ffffff' : '#212529',
    textSub: isDarkMode ? '#adb5bd' : '#666666',
    border: isDarkMode ? '#2d3139' : '#e0e0e0',
    btnClose: isDarkMode ? '#f57c00' : '#212529',
    iconBgOrange: isDarkMode ? 'rgba(245, 124, 0, 0.15)' : '#fff3e0',
    iconBgBlue: isDarkMode ? 'rgba(16, 114, 186, 0.15)' : '#e3f2fd',
    iconBgGreen: isDarkMode ? 'rgba(46, 125, 50, 0.15)' : '#e8f5e9',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.bgMain }]}>
      {/* En-tête Premium Jula */}
      <View style={[styles.headerBar, { backgroundColor: themeColors.bgCard, borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={themeColors.textMain} />
        </TouchableOpacity>
        <Text style={[styles.headerBarTitle, { color: themeColors.textMain }]}>Nos Services Jula</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionLabel, { color: themeColors.textSub }]}>
          Écosystème Jula Network (CI, SN, ML, BF, NE, BJ, TG)
        </Text>

        {/* CARTE 1 : DEVENIR VENDEUR (Ouvre directement le portail web Render) */}
        <TouchableOpacity
          style={[styles.serviceCard, { backgroundColor: themeColors.bgCard }]}
          onPress={() =>
            Alert.alert(
              '🏪 Portail Partenaires & Grossistes',
              'Vous allez être redirigé vers notre portail officiel d’inscription sur le web pour créer votre boutique.',
              [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Ouvrir le site', onPress: () => Linking.openURL(URL_PORTAIL_VENDEUR) },
              ]
            )
          }
        >
          <View style={[styles.iconBox, { backgroundColor: themeColors.iconBgOrange }]}>
            <Text style={styles.cardIcon}>🏪</Text>
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.cardTitle}>Devenir Grossiste Jula</Text>
            <Text style={[styles.cardDescription, { color: themeColors.textSub }]}>
              Inscrivez votre boutique sur notre portail web et propulsez vos stocks depuis Adjamé, Sandaga, Dantokpa, Assigamé, Bamako, Ouagadougou et Niamey.
            </Text>
          </View>
          <Feather name="external-link" size={18} color="#f57c00" />
        </TouchableOpacity>

        {/* CARTE 2 : JULA PAY / FINANCES */}
        <TouchableOpacity
          style={[styles.serviceCard, { backgroundColor: themeColors.bgCard, borderLeftColor: '#1072ba' }]}
          onPress={() => router.push('/(client)/wallet')}
        >
          <View style={[styles.iconBox, { backgroundColor: themeColors.iconBgBlue }]}>
            <Text style={styles.cardIcon}>💰</Text>
          </View>
          <View style={styles.textBlock}>
            <Text style={[styles.cardTitle, { color: '#1072ba' }]}>Jula Pay & Finances</Text>
            <Text style={[styles.cardDescription, { color: themeColors.textSub }]}>
              Sécurisez vos encaissements et gérez vos revenus Wave, Orange Money, MTN et Moov au sein des 7 pays de la zone UEMOA.
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color="#1072ba" />
        </TouchableOpacity>

        {/* CARTE 3 : FORMATION JULA ACADÉMIE */}
        <TouchableOpacity
          style={[styles.serviceCard, { backgroundColor: themeColors.bgCard, borderLeftColor: '#2e7d32' }]}
          onPress={() =>
            Alert.alert(
              '🎓 Académie Jula',
              'Guides de vente en ligne, gestion des stocks et optimisation des livraisons inter-états disponibles dans votre salon d’assistance.',
              [
                { text: 'Fermer', style: 'cancel' },
                { text: 'Poser une question à l’IA', onPress: () => router.push('/(client)/chat') },
              ]
            )
          }
        >
          <View style={[styles.iconBox, { backgroundColor: themeColors.iconBgGreen }]}>
            <Text style={styles.cardIcon}>🎓</Text>
          </View>
          <View style={styles.textBlock}>
            <Text style={[styles.cardTitle, { color: '#2e7d32' }]}>Formation Académie Jula</Text>
            <Text style={[styles.cardDescription, { color: themeColors.textSub }]}>
              Apprenez à maîtriser les outils numériques Jula, optimisez vos livraisons et développez votre commerce régional.
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color="#2e7d32" />
        </TouchableOpacity>

        {/* Bouton retour */}
        <TouchableOpacity style={[styles.buttonClose, { backgroundColor: themeColors.btnClose }]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>← Revenir au Profil</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, paddingTop: 40, gap: 15 },
  backButton: { padding: 2 },
  headerBarTitle: { fontSize: 17, fontWeight: 'bold' },
  scrollContainer: { padding: 15 },
  sectionLabel: { fontSize: 12, fontWeight: 'bold', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 0.5 },
  serviceCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, padding: 16, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#f57c00', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  iconBox: { width: 45, height: 45, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  cardIcon: { fontSize: 22 },
  textBlock: { flex: 1, paddingHorizontal: 15 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#f57c00' },
  cardDescription: { fontSize: 12, marginTop: 4, lineHeight: 17, textAlign: 'justify' },
  buttonClose: { padding: 13, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});
