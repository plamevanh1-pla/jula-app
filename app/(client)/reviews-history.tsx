import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';

export default function ReviewsHistoryScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  // Palette dynamique (Clair / Sombre)
  const themeColors = {
    bgMain: isDarkMode ? '#111417' : '#f8f9fa',
    bgCard: isDarkMode ? '#1a1d21' : '#ffffff',
    bgCircle: isDarkMode ? 'rgba(46, 125, 50, 0.15)' : '#e8f5e9',
    textMain: isDarkMode ? '#ffffff' : '#212529',
    textSub: isDarkMode ? '#adb5bd' : '#6c757d',
    border: isDarkMode ? '#2d3139' : '#dee2e6',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.bgMain }]}>
      <View style={[styles.header, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={themeColors.textMain} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textMain }]}>Notes & Avis</Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: themeColors.bgCircle }]}>
          <Feather name="edit-3" size={45} color="#2e7d32" />
        </View>
        <Text style={[styles.title, { color: themeColors.textMain }]}>Aucun avis en attente</Text>
        <Text style={[styles.subtitle, { color: themeColors.textSub }]}>
          Après avoir reçu ton colis en Côte d'Ivoire, au Sénégal, au Mali, au Burkina Faso, au Niger, au Bénin ou au Togo, tu pourras noter ton grossiste ici !
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, paddingTop: 40, gap: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  iconCircle: { width: 90, height: 90, borderRadius: 45, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 13, textAlign: 'center', lineHeight: 20 }
});
