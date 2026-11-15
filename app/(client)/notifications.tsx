import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';

export default function NotificationPreferencesScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();

  // États de mémoire pour gérer la position des boutons bascules (Switches)
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [marketingOffers, setMarketingOffers] = useState(false);

  // Palette dynamique (Clair / Sombre)
  const themeColors = {
    bgMain: isDarkMode ? '#111417' : '#f4f6f9',
    bgCard: isDarkMode ? '#1a1d21' : '#ffffff',
    textMain: isDarkMode ? '#ffffff' : '#212529',
    textSub: isDarkMode ? '#adb5bd' : '#495057',
    textLabel: isDarkMode ? '#9ca3af' : '#7f8c8d',
    border: isDarkMode ? '#2d3139' : '#dee2e6',
  };

  const handleSave = () => {
    Alert.alert('✅ Enregistré', 'Vos préférences de notification ont été mises à jour.');
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.bgMain }]}>
      {/* Barre d'en-tête */}
      <View style={[styles.headerBar, { backgroundColor: themeColors.bgCard, borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={themeColors.textMain} />
        </TouchableOpacity>
        <Text style={[styles.headerBarTitle, { color: themeColors.textMain }]}>Préférences de notification</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* BLOC 1 : RECOMMANDÉ */}
        <View style={[styles.card, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border, borderWidth: isDarkMode ? 1 : 0 }]}>
          <Text style={[styles.recommendLabel, { color: themeColors.textLabel }]}>
            Recommandé (restez informé de vos commandes)
          </Text>

          <View style={styles.row}>
            <View style={styles.textBlock}>
              <Text style={[styles.rowTitle, { color: themeColors.textMain }]}>Mises à jour des commandes</Text>
              <Text style={[styles.bulletPoint, { color: themeColors.textSub }]}>
                • Recevez des mises à jour en temps réel sur le statut de vos commandes.
              </Text>
              <Text style={[styles.bulletPoint, { color: themeColors.textSub }]}>
                • Sachez quand votre commande est disponible.
              </Text>
            </View>

            <Switch
              trackColor={{ false: '#767577', true: '#ffcc80' }}
              thumbColor={orderUpdates ? '#f57c00' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setOrderUpdates(!orderUpdates)}
              value={orderUpdates}
            />
          </View>
        </View>

        {/* BLOC 2 : OPTIONNEL */}
        <View style={[styles.card, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border, borderWidth: isDarkMode ? 1 : 0 }]}>
          <Text style={[styles.recommendLabel, { color: themeColors.textLabel }]}>
            Optionnel (notifications personnalisées et offres marketing)
          </Text>

          <View style={styles.row}>
            <View style={styles.textBlock}>
              <Text style={[styles.rowTitle, { color: themeColors.textMain }]}>Offres et marketing</Text>
              <Text style={[styles.bulletPoint, { color: themeColors.textSub }]}>
                • Recevez des mises à jour en temps réel sur les dernières offres.
              </Text>
              <Text style={[styles.bulletPoint, { color: themeColors.textSub }]}>
                • Recevez des offres personnalisées.
              </Text>
            </View>

            <Switch
              trackColor={{ false: '#767577', true: '#ffcc80' }}
              thumbColor={marketingOffers ? '#f57c00' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setMarketingOffers(!marketingOffers)}
              value={marketingOffers}
            />
          </View>
        </View>

        {/* Bouton de sauvegarde */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Enregistrer les préférences</Text>
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
  scrollContainer: { padding: 12 },
  card: { borderRadius: 8, padding: 16, marginBottom: 15, elevation: 1 },
  recommendLabel: { fontSize: 12, fontWeight: '600', marginBottom: 15, lineHeight: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  textBlock: { flex: 1, paddingRight: 10 },
  rowTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  bulletPoint: { fontSize: 12, lineHeight: 18, marginVertical: 2, paddingLeft: 5 },
  saveButton: { backgroundColor: '#f57c00', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10, elevation: 2 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});
