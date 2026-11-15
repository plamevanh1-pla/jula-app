import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AppearanceSelector from '../../src/components/AppearanceSelector';
import { useTheme } from '../../src/context/ThemeContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  // Palette dynamique (Clair / Sombre)
  const themeColors = {
    bgMain: isDarkMode ? '#111417' : '#f8f9fa',
    bgCard: isDarkMode ? '#1a1d21' : '#ffffff',
    textMain: isDarkMode ? '#ffffff' : '#212529',
    textSub: isDarkMode ? '#adb5bd' : '#495057',
    border: isDarkMode ? '#2d3139' : '#e9ecef',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.bgMain }]}>
      {/* Barre d'en-tête supérieure */}
      <View style={[styles.header, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={themeColors.textMain} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textMain }]}>Paramètres Jula</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Contenu principal de la page */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Affichage & Thème</Text>
        <AppearanceSelector />
        
        <Text style={styles.sectionTitle}>À propos</Text>
        <View style={[styles.infoCard, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]}>
          <Text style={[styles.infoText, { color: themeColors.textSub }]}>Version de l'application : v1.1.0</Text>
          <Text style={[styles.infoText, { color: themeColors.textSub }]}>Réseau Logistique UEMOA (7 Pays)</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 60, borderBottomWidth: 1, paddingTop: 10 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: 'bold' },
  content: { padding: 16 },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#7f8c8d', marginTop: 20, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoCard: { padding: 16, borderRadius: 8, borderWidth: 1 },
  infoText: { fontSize: 13.5, marginBottom: 4 }
});
