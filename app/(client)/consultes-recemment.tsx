import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';


export default function ConsultesRecemmentScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  // Palette dynamique (Clair / Sombre)
  const themeColors = {
    bgMain: isDarkMode ? '#111417' : '#f8f9fa',
    bgCard: isDarkMode ? '#1a1d21' : '#ffffff',
    bgCircle: isDarkMode ? '#1a1d21' : '#e9ecef',
    textMain: isDarkMode ? '#ffffff' : '#212529',
    textSub: isDarkMode ? '#adb5bd' : '#6c757d',
    border: isDarkMode ? '#2d3139' : '#dee2e6',
    btnBg: isDarkMode ? '#f57c00' : '#212529',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.bgMain }]}>
      <View style={[styles.header, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={themeColors.textMain} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textMain }]}>Consultés Récemment</Text>
      </View>

      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: themeColors.bgCircle }]}>
          <Feather name="clock" size={45} color={isDarkMode ? '#adb5bd' : '#6c757d'} />
        </View>
        <Text style={[styles.title, { color: themeColors.textMain }]}>Votre historique est vide</Text>
        <Text style={[styles.subtitle, { color: themeColors.textSub }]}>
          Les smartphones, tablettes et articles électroniques que vous visitez sur Jula s'afficheront ici automatiquement.
        </Text>
        
        <TouchableOpacity 
          style={[styles.btnAction, { backgroundColor: themeColors.btnBg }]} 
          onPress={() => router.replace('/(client)/(tabs)/home')}
        >
          <Text style={styles.btnText}>Parcourir le Catalogue</Text>
        </TouchableOpacity>
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
  title: { fontSize: 19, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginBottom: 25 },
  btnAction: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});
