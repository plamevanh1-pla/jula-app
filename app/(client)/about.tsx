  import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// 🟢 IMPORTATION DE L'ICÔNE FEATHER POUR LA BARRE SUPÉRIEURE
import Feather from '@expo/vector-icons/Feather';

export default function AboutScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const layoutRefs = useRef<{ [key: number]: number }>({});

  const scrollVersSection = (id: number) => {
    const yPosition = layoutRefs.current[id];
    if (yPosition !== undefined && scrollRef.current) {
      scrollRef.current.scrollTo({ y: yPosition, animated: true });
    }
  };

  const capturerPosition = (id: number, y: number) => {
    layoutRefs.current[id] = y;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔍 BARRE DE RETOUR MODERNE INTÉGRÉE POUR EVITER LE BLOCAGE */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#212529" />
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>À propos de Jula</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏢 À propos de Jula Network</Text>
        <Text style={styles.headerSubtitle}>L'écosystème e-commerce des grossistes d'Afrique de l'Ouest</Text>
      </View>

      <ScrollView ref={scrollRef} style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <View style={styles.sommaireBox}>
          <Text style={styles.sommaireTitle}>📌 Sommaire interactif Jula Network</Text>
          <Text style={styles.sommaireSubtitle}>Touchez un pavé pour descendre directement aux détails :</Text>
          
          <View style={styles.gridContainer}>
            <TouchableOpacity style={styles.gridButton} onPress={() => scrollVersSection(1)}>
              <Text style={styles.gridButtonText}>🧡 1. Qui sommes-nous ?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.gridButton, { borderColor: '#1072ba' }]} onPress={() => scrollVersSection(2)}>
              <Text style={[styles.gridButtonText, { color: '#1072ba' }]}>⚙️ 2. Fonctionnement</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridButton} onPress={() => scrollVersSection(3)}>
              <Text style={styles.gridButtonText}>🇨🇮 3. Filiale Côte d'Ivoire</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridButton} onPress={() => scrollVersSection(4)}>
              <Text style={styles.gridButtonText}>🇸🇳 4. Filiale Sénégal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridButton} onPress={() => scrollVersSection(5)}>
              <Text style={styles.gridButtonText}>🇧🇯 5. Filiale Bénin</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.gridButton} onPress={() => scrollVersSection(6)}>
              <Text style={styles.gridButtonText}>🇹🇬 6. Filiale Togo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.gridButton, { width: '100%', borderColor: '#2e7d32' }]} onPress={() => scrollVersSection(7)}>
              <Text style={[styles.gridButtonText, { color: '#2e7d32' }]}>🔐 7. Sécurité & Protection Supabase</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionDivider}>📄 COEUR DES RÈGLEMENTS ET FILIALES JULA</Text>
        <View style={styles.sectionCard} onLayout={(e) => capturerPosition(1, e.nativeEvent.layout.y)}>
          <Text style={styles.sectionTitle}>1. Qui sommes-nous ?</Text>
          <Text style={styles.sectionBody}>
            Jula n'est pas un site de vente classique. Nous sommes la première plateforme technologique ouest-africaine qui unifie et digitalise le réseau des commerçants grossistes, des transporteurs et des points de stockage de quartier. Notre rôle est de briser les barrières logistiques pour connecter les acheteurs directement à la source des marchandises.
          </Text>
        </View>

        <View style={[styles.sectionCard, { borderLeftColor: '#1072ba' }]} onLayout={(e) => capturerPosition(2, e.nativeEvent.layout.y)}>
          <Text style={[styles.sectionTitle, { color: '#1072ba' }]}>2. Comment fonctionne le réseau ?</Text>
          <Text style={styles.sectionBody}>
            • Les Grossistes propulsent leurs stocks en direct de leurs magasins via leur tableau de bord PC.{"\n"}
            • Les Clients achètent en un clic au prix d'usine réel de la zone UEMOA.{"\n"}
            • La Flotte Jula Express (Livreurs à moto connectés en direct) récupère le colis au dépôt.{"\n"}
            • Les Points Relais sécurisent le stockage de proximité pour un retrait confortable.
          </Text>
        </View>

        <View style={styles.sectionCard} onLayout={(e) => capturerPosition(3, e.nativeEvent.layout.y)}>
          <Text style={styles.sectionTitle}>3. Filiale Côte d'Ivoire (Siège Régional)</Text>
          <Text style={styles.sectionBody}>
            • Hub Principal : Abidjan, Adjamé (Zone des Grossistes) et Bouaké.{"\n"}
            • Rôle : Centralisation des flux de la sous-région et coordination de la flotte logistique ivoirienne.{"\n"}
            • Contact Direction : ci@jula.com / +225 07 00 00 00 00.{"\n"}
            • Point Relais Pilote : Guichet Central d'Adjamé face à la grande mosquée.
          </Text>
        </View>

        <View style={styles.sectionCard} onLayout={(e) => capturerPosition(4, e.nativeEvent.layout.y)}>
          <Text style={styles.sectionTitle}>4. Filiale Sénégal (Hub Teranga)</Text>
          <Text style={styles.sectionBody}>
            • Hub Principal : Dakar, Marché Sandaga et Marché Petersen.{"\n"}
            • Rôle : Importation et redistribution des articles de mode et high-tech pour le marché sénégalais.{"\n"}
            • Contact Direction : sn@jula.com / +221 33 000 00 00.{"\n"}
            • Logistique : Flotte de coursiers à moto pour Dakar, Thiès et Mbour.
          </Text>
        </View>

        <View style={styles.sectionCard} onLayout={(e) => capturerPosition(5, e.nativeEvent.layout.y)}>
          <Text style={styles.sectionTitle}>5. Filiale Bénin (Passerelle Commerciale)</Text>
          <Text style={styles.sectionBody}>
            • Hub Principal : Cotonou, Marché Dantokpa.{"\n"}
            • Rôle : Hub de distribution en direct des importateurs du port autonome de Cotonou (Textile, pièces détachées).{"\n"}
            • Contact Direction : bj@jula.com / +229 21 00 00 00.{"\n"}
            • Stockage : 15 points relais partenaires actifs à Cotonou et Porto-Novo.
          </Text>
        </View>

        <View style={styles.sectionCard} onLayout={(e) => capturerPosition(6, e.nativeEvent.layout.y)}>
          <Text style={styles.sectionTitle}>6. Filiale Togo (Carrefour Transit)</Text>
          <Text style={styles.sectionBody}>
            • Hub Principal : Lomé, Grand Marché d'Assigamé.{"\n"}
            • Rôle : Plateforme d'aiguillage rapide des colis fluides pour la zone côtière togolaise.{"\n"}
            • Contact Direction : tg@jula.com / +228 22 00 00 00.{"\n"}
            • Proximité : Retrait sécurisé intégré aux boutiques de quartier de Lomé Commune.
          </Text>
        </View>

        <View style={[styles.sectionCard, { borderLeftColor: '#2e7d32' }]} onLayout={(e) => capturerPosition(7, e.nativeEvent.layout.y)}>
          <Text style={[styles.sectionTitle, { color: '#2e7d32' }]}>7. Protection des Données & Supabase</Text>
          <Text style={styles.sectionBody}>
            La transparence est au cœur de Jula. Toutes les données d'utilisateurs réels (e-mails, numéros de téléphone et CNI des marchands) sont verrouillées par le système de sécurité strict de Supabase. Vos coordonnées ne sont partagées qu'avec le livreur au moment exact de l'expédition pour garantir la confidentialité de vos transactions.
          </Text>
        </View>

        <TouchableOpacity style={styles.buttonClose} onPress={() => router.back()}>
          <Text style={styles.buttonText}>← Revenir à mon Profil</Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  headerBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#dee2e6', paddingTop: 40, gap: 12 },
  backButton: { padding: 2 },
  headerBarTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  header: { backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#f57c00' },
  headerSubtitle: { fontSize: 12, color: '#6c757d', marginTop: 4 },
  scrollContainer: { padding: 12 },
  sommaireBox: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 15, elevation: 1 },
  sommaireTitle: { fontSize: 14, fontWeight: 'bold', color: '#212529' },
  sommaireSubtitle: { fontSize: 12, color: '#6c757d', marginTop: 4, marginBottom: 15 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridButton: { width: '48%', backgroundColor: '#fff', borderWidth: 1, borderColor: '#f57c00', borderRadius: 6, padding: 10, justifyContent: 'center' },
  gridButtonText: { fontSize: 11, fontWeight: '600', color: '#f57c00', textAlign: 'center' },
  sectionDivider: { fontSize: 11, fontWeight: 'bold', color: '#7f8c8d', marginVertical: 15, paddingHorizontal: 4 },
  sectionCard: { backgroundColor: '#fff', borderRadius: 8, padding: 16, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#f57c00', elevation: 1 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#212529', marginBottom: 8 },
  sectionBody: { fontSize: 13, color: '#495057', lineHeight: 20, textAlign: 'justify' },
  buttonClose: { backgroundColor: '#212529', padding: 13, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});
