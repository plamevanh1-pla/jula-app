import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/(client)/(tabs)/profile')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>À Propos & CGV Jula</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* 🍊 SECTION 1 : À PROPOS DE JULA */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>🍊 À Propos de Jula</Text>
          <Text style={styles.textBody}>
            Jula est la première plateforme interconnectée de réseau social e-commerce et de logistique intégrée en Afrique de l'Ouest.
          </Text>
          <Text style={styles.textBody}>
            Présente au <Text style={styles.bold}>Sénégal 🇸🇳, en Côte d'Ivoire 🇨🇮, au Togo 🇹🇬 et au Bénin 🇧🇯</Text>, notre mission est de digitaliser le commerce de proximité en connectant instantanément les clients, les boutiques vendeuses et les livreurs de confiance (Motos 🛵 & Véhicules 🚚) à travers un réseau de Points Relais sécurisés.
          </Text>
          <Text style={styles.versionText}>Version de l'application : 1.0.0 (Production)</Text>
        </View>

        {/* ⚖️ SECTION 2 : CONDITIONS GÉNÉRALES DE VENTE */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>⚖️ Conditions Générales de Vente (CGV)</Text>
          
          <Text style={styles.subTitle}>1. Objet du Service</Text>
          <Text style={styles.textBody}>
            Jula fournit une infrastructure technologique permettant la publication d'articles par les vendeurs certifiés et la gestion de la livraison par des partenaires logistiques indépendants en zone CFA (XOF).
          </Text>

          <Text style={styles.subTitle}>2. Inscription et Profils</Text>
          <Text style={styles.textBody}>
            Chaque utilisateur s'engage à fournir des informations réelles lors de son inscription. Les profils Boutique et Livreur font l'objet d'une validation d'identité stricte par les équipes de Jula.
          </Text>

          <Text style={styles.subTitle}>3. Système de Paiement et Commissions</Text>
          <Text style={styles.textBody}>
            Les transactions s'effectuent via les portefeuilles sécurisés intégrés. Les livreurs et points relais partenaires perçoivent une commission fixe et transparente en FCFA validée dès la confirmation de réception de la commande.
          </Text>

          <Text style={styles.subTitle}>4. Sécurité et Litiges</Text>
          <Text style={styles.textBody}>
            Toutes les données de l'application sont cryptées et gérées via notre infrastructure Supabase et Render. En cas de litige sur une livraison, le support client Jula centralise la résolution via le Chat en direct.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f6' },
  header: { backgroundColor: '#f57c00', padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 40 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  scrollContent: { padding: 16 },
  sectionCard: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 16, elevation: 2 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#f57c00', marginBottom: 12 },
  subTitle: { fontSize: 14, fontWeight: 'bold', color: '#212529', marginTop: 10, marginBottom: 4 },
  textBody: { fontSize: 13, color: '#495057', lineHeight: 18, marginBottom: 10, textAlign: 'justify' },
  bold: { fontWeight: 'bold', color: '#212529' },
  versionText: { fontSize: 11, color: '#95a5a6', marginTop: 10, fontStyle: 'italic' }
});
