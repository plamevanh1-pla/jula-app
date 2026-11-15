import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';


export default function HelpScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  // Palette dynamique (Clair / Sombre)
  const themeColors = {
    bgMain: isDarkMode ? '#111417' : '#f8f9fa',
    bgCard: isDarkMode ? '#1a1d21' : '#ffffff',
    bgIconCircle: isDarkMode ? 'rgba(217, 83, 79, 0.15)' : '#fdeaea',
    textMain: isDarkMode ? '#ffffff' : '#212529',
    textSub: isDarkMode ? '#adb5bd' : '#6c757d',
    border: isDarkMode ? '#2d3139' : '#dee2e6',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.bgMain }]}>
      {/* En-tête */}
      <View style={[styles.header, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={themeColors.textMain} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textMain }]}>Aide & Assistance</Text>
      </View>

      {/* Corps du message */}
      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: themeColors.bgIconCircle }]}>
          <Feather name="user-x" size={50} color="#d9534f" />
        </View>
        <Text style={[styles.title, { color: themeColors.textMain }]}>Aucun conseiller disponible</Text>
        <Text style={[styles.subtitle, { color: themeColors.textSub }]}>
          Nos équipes de support pour la Côte d'Ivoire 🇨🇮, le Sénégal 🇸🇳, le Mali 🇲🇱, le Burkina Faso 🇧🇫, le Niger 🇳🇪, le Bénin 🇧🇯 et le Togo 🇹🇬 sont actuellement hors ligne.
        </Text>
        
        <View style={[styles.infoBox, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]}>
          <Text style={[styles.infoText, { color: themeColors.textMain }]}>⏰ Horaires d'assistance :</Text>
          <Text style={styles.infoSub}>Du Lundi au Vendredi • 8h00 - 18h00 (GMT)</Text>
        </View>

        {/* Bouton prêt pour rediriger vers ton salon de messagerie ou l'assistant IA */}
        <TouchableOpacity 
          style={styles.chatButton} 
          onPress={() => router.push('/(client)/chat')}
        >
          <Feather name="message-circle" size={18} color="#fff" />
          <Text style={styles.chatButtonText}>Laisser un message au Support / IA</Text>
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
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
  infoBox: { marginTop: 30, padding: 16, borderRadius: 8, borderWidth: 1, width: '100%', alignItems: 'center' },
  infoText: { fontSize: 14, fontWeight: 'bold' },
  infoSub: { fontSize: 13, color: '#7f8c8d', marginTop: 4 },
  chatButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f57c00', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 8, marginTop: 20, width: '100%', gap: 10 },
  chatButtonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' }
});
