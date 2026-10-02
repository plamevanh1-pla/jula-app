  import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ServicesScreen() {
  const router = useRouter();

  const ouvrirService = (nomService: string) => {
    Alert.alert("✨ Service Jula", `Le module complet de : "${nomService}" ouvrira ses portes lors du lancement officiel.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête Premium Jula */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>À propos de nos Services</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Écosystème Jula Network (CI, SN, BJ, TG)</Text>

        {/* CARTE 1 : DEVENIR VENDEUR */}
        <TouchableOpacity style={styles.serviceCard} onPress={() => ouvrirService("Devenir Grossiste Jula")}>
          <View style={[styles.iconBox, { backgroundColor: '#fff3e0' }]}>
            <Text style={styles.cardIcon}>🏪</Text>
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.cardTitle}>Devenir Grossiste Jula</Text>
            <Text style={styles.cardDescription}>
              Propulsez vos stocks en direct des grands marchés d'Adjamé, Dantokpa ou Sandaga vers des milliers de clients.
            </Text>
          </View>
          <Text style={styles.arrowIcon}>➔</Text>
        </TouchableOpacity>

        {/* CARTE 2 : JULA PAY / FINANCES */}
        <TouchableOpacity style={[styles.serviceCard, { borderLeftColor: '#1072ba' }]} onPress={() => ouvrirService("Jula Pay & Finances")}>
          <View style={[styles.iconBox, { backgroundColor: '#e3f2fd' }]}>
            <Text style={styles.cardIcon}>💰</Text>
          </View>
          <View style={styles.textBlock}>
            <Text style={[styles.cardTitle, { color: '#1072ba' }]}>Jula Pay & Finances</Text>
            <Text style={styles.cardDescription}>
              Sécurisez vos encaissements et gérez vos revenus Wave, Orange, MTN et Moov au sein de la zone UEMOA.
            </Text>
          </View>
          <Text style={[styles.arrowIcon, { color: '#1072ba' }]}>➔</Text>
        </TouchableOpacity>

        {/* CARTE 3 : FORMATION JULA ACADÉMIE */}
        <TouchableOpacity style={[styles.serviceCard, { borderLeftColor: '#2e7d32' }]} onPress={() => ouvrirService("Formation Académie Jula")}>
          <View style={[styles.iconBox, { backgroundColor: '#e8f5e9' }]}>
            <Text style={styles.cardIcon}>🎓</Text>
          </View>
          <View style={styles.textBlock}>
            <Text style={[styles.cardTitle, { color: '#2e7d32' }]}>Formation Académie Jula</Text>
            <Text style={styles.cardDescription}>
              Apprenez à maîtriser les outils numériques Jula, optimisez vos livraisons et développez votre commerce régional.
            </Text>
          </View>
          <Text style={[styles.arrowIcon, { color: '#2e7d32' }]}>➔</Text>
        </TouchableOpacity>

        {/* Bouton retour */}
        <TouchableOpacity style={styles.buttonClose} onPress={() => router.back()}>
          <Text style={styles.buttonText}>← Revenir au Profil</Text>
        </TouchableOpacity>
        
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  headerBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#e0e0e0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  backButton: { marginRight: 15 },
  backArrow: { fontSize: 22, color: '#333', fontWeight: 'bold' },
  headerBarTitle: { fontSize: 17, fontWeight: 'bold', color: '#333' },
  
  scrollContainer: { padding: 15 },
  sectionLabel: { fontSize: 12, color: '#666', fontWeight: 'bold', marginBottom: 15, textTransform: 'uppercase', letterSpacing: 0.5 },
  
  // Style des Cartes Modernes Jula
  serviceCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 16, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#f57c00', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  iconBox: { width: 45, height: 45, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  cardIcon: { fontSize: 22 },
  textBlock: { flex: 1, paddingHorizontal: 15 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#e65100' },
  cardDescription: { fontSize: 12, color: '#666', marginTop: 4, lineHeight: 17, textAlign: 'justify' },
  arrowIcon: { fontSize: 14, color: '#f57c00', fontWeight: 'bold' },
  
  buttonClose: { backgroundColor: '#212529', padding: 13, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});
