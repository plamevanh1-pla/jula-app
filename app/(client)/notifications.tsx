import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function NotificationPreferencesScreen() {
  const router = useRouter();

  // États de mémoire pour gérer la position des boutons bascules (Switches)
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [marketingOffers, setMarketingOffers] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      {/* Barre d'en-tête avec bouton retour */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>Préférences de notification</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* BLOC 1 : RECOMMANDÉ */}
        <View style={styles.card}>
          <Text style={styles.recommendLabel}>Recommandé (restez informé de vos commandes)</Text>
          
          <View style={styles.row}>
            <View style={styles.textBlock}>
              <Text style={styles.rowTitle}>Mises à jour des commandes</Text>
              <Text style={styles.bulletPoint}>
                • Recevez des mises à jour en temps réel sur le statut de vos commandes.
              </Text>
              <Text style={styles.bulletPoint}>
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
        <View style={styles.card}>
          <Text style={styles.recommendLabel}>Optionnel (notifications personnalisées et offres marketing)</Text>
          
          <View style={styles.row}>
            <View style={styles.textBlock}>
              <Text style={styles.rowTitle}>Offres et marketing</Text>
              <Text style={styles.bulletPoint}>
                • Recevez des mises à jour en temps réel sur les dernières offres.
              </Text>
              <Text style={styles.bulletPoint}>
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
        <TouchableOpacity style={styles.saveButton} onPress={() => router.back()}>
          <Text style={styles.saveButtonText}>Enregistrer les préférences</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  headerBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  backButton: { marginRight: 15 },
  backArrow: { fontSize: 22, color: '#333', fontWeight: 'bold' },
  headerBarTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  
  scrollContainer: { padding: 12 },
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  recommendLabel: { fontSize: 12, color: '#777', fontWeight: '600', marginBottom: 15, lineHeight: 16 },
  
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  textBlock: { flex: 1, paddingRight: 10 },
  rowTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  bulletPoint: { fontSize: 12, color: '#555', lineHeight: 18, marginVertical: 2, paddingLeft: 5 },
  
  saveButton: { backgroundColor: '#f57c00', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3, elevation: 3 },
  saveButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});
