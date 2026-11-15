import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';


export default function AboutScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
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

  // Palette dynamique (Clair / Sombre)
  const themeColors = {
    bgMain: isDarkMode ? '#111417' : '#f4f6f9',
    bgCard: isDarkMode ? '#1a1d21' : '#ffffff',
    textMain: isDarkMode ? '#ffffff' : '#212529',
    textBody: isDarkMode ? '#d1d5db' : '#495057',
    textSub: isDarkMode ? '#9ca3af' : '#6c757d',
    border: isDarkMode ? '#2d3139' : '#dee2e6',
    btnClose: isDarkMode ? '#f57c00' : '#212529',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.bgMain }]}>
      <View style={[styles.headerBar, { backgroundColor: themeColors.bgCard, borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={themeColors.textMain} />
        </TouchableOpacity>
        <Text style={[styles.headerBarTitle, { color: themeColors.textMain }]}>À propos de Jula</Text>
      </View>

      <View style={[styles.header, { backgroundColor: themeColors.bgCard, borderBottomColor: themeColors.border }]}>
        <Text style={styles.headerTitle}>🏢 À propos de Jula Network</Text>
        <Text style={[styles.headerSubtitle, { color: themeColors.textSub }]}>
          L'écosystème e-commerce des grossistes d'Afrique de l'Ouest
        </Text>
      </View>

      <ScrollView ref={scrollRef} style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={[styles.sommaireBox, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border, borderWidth: isDarkMode ? 1 : 0 }]}>
          <Text style={[styles.sommaireTitle, { color: themeColors.textMain }]}>📌 Sommaire interactif Jula Network</Text>
          <Text style={[styles.sommaireSubtitle, { color: themeColors.textSub }]}>
            Touchez un pavé pour descendre directement aux détails :
          </Text>
          
          <View style={styles.gridContainer}>
            <TouchableOpacity style={[styles.gridButton, { backgroundColor: themeColors.bgCard }]} onPress={() => scrollVersSection(1)}>
              <Text style={styles.gridButtonText}>🧡 1. Qui sommes-nous ?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.gridButton, { backgroundColor: themeColors.bgCard, borderColor: '#1072ba' }]} onPress={() => scrollVersSection(2)}>
              <Text style={[styles.gridButtonText, { color: '#1072ba' }]}>⚙️ 2. Fonctionnement</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.gridButton, { backgroundColor: themeColors.bgCard }]} onPress={() => scrollVersSection(3)}>
              <Text style={styles.gridButtonText}>🇨🇮 3. Côte d'Ivoire</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.gridButton, { backgroundColor: themeColors.bgCard }]} onPress={() => scrollVersSection(4)}>
              <Text style={styles.gridButtonText}>🇸🇳 4. Sénégal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.gridButton, { backgroundColor: themeColors.bgCard }]} onPress={() => scrollVersSection(5)}>
              <Text style={styles.gridButtonText}>🇲🇱 5. Mali</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.gridButton, { backgroundColor: themeColors.bgCard }]} onPress={() => scrollVersSection(6)}>
              <Text style={styles.gridButtonText}>🇧🇫 6. Burkina Faso</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.gridButton, { backgroundColor: themeColors.bgCard }]} onPress={() => scrollVersSection(7)}>
              <Text style={styles.gridButtonText}>🇳🇪 7. Niger</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.gridButton, { backgroundColor: themeColors.bgCard }]} onPress={() => scrollVersSection(8)}>
              <Text style={styles.gridButtonText}>🇧🇯 8. Bénin</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.gridButton, { backgroundColor: themeColors.bgCard }]} onPress={() => scrollVersSection(9)}>
              <Text style={styles.gridButtonText}>🇹🇬 9. Togo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.gridButton, { width: '100%', backgroundColor: themeColors.bgCard, borderColor: '#2e7d32' }]} onPress={() => scrollVersSection(10)}>
              <Text style={[styles.gridButtonText, { color: '#2e7d32' }]}>🔐 10. Sécurité & Confidentialité</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionDivider}>📄 PRÉSENTATION ET FILIALES ZONE UEMOA</Text>

        <View style={[styles.sectionCard, { backgroundColor: themeColors.bgCard }]} onLayout={(e) => capturerPosition(1, e.nativeEvent.layout.y)}>
          <Text style={[styles.sectionTitle, { color: themeColors.textMain }]}>1. Qui sommes-nous ?</Text>
          <Text style={[styles.sectionBody, { color: themeColors.textBody }]}>
            Jula est la première plateforme technologique ouest-africaine qui unifie et digitalise le réseau des commerçants grossistes, des transporteurs et des points de stockage de quartier. Notre rôle est de briser les barrières logistiques pour connecter les acheteurs directement à la source des marchandises.
          </Text>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: themeColors.bgCard, borderLeftColor: '#1072ba' }]} onLayout={(e) => capturerPosition(2, e.nativeEvent.layout.y)}>
          <Text style={[styles.sectionTitle, { color: '#1072ba' }]}>2. Comment fonctionne le réseau ?</Text>
          <Text style={[styles.sectionBody, { color: themeColors.textBody }]}>
            • Les Grossistes publient leurs stocks en direct depuis leurs magasins via leur espace marchand.{"\n"}
            • Les Clients achètent en un clic au prix réel du marché dans toute la zone UEMOA.{"\n"}
            • La Flotte Jula Express récupère le colis au dépôt et assure le transport inter-états.{"\n"}
            • Les Points Relais sécurisent le stockage de proximité pour un retrait rapide.
          </Text>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: themeColors.bgCard }]} onLayout={(e) => capturerPosition(3, e.nativeEvent.layout.y)}>
          <Text style={[styles.sectionTitle, { color: themeColors.textMain }]}>3. Filiale Côte d'Ivoire 🇨🇮 (Siège Régional)</Text>
          <Text style={[styles.sectionBody, { color: themeColors.textBody }]}>
            • Hub Principal : Abidjan (Adjamé) et Bouaké.{"\n"}
            • Rôle : Centralisation des flux de la sous-région et coordination de la flotte logistique ivoirienne.{"\n"}
            • Contact Direction : ci@jula.com / +225 07 00 00 00 00.
          </Text>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: themeColors.bgCard }]} onLayout={(e) => capturerPosition(4, e.nativeEvent.layout.y)}>
          <Text style={[styles.sectionTitle, { color: themeColors.textMain }]}>4. Filiale Sénégal 🇸🇳 (Hub Teranga)</Text>
          <Text style={[styles.sectionBody, { color: themeColors.textBody }]}>
            • Hub Principal : Dakar, Marché Sandaga et Marché Petersen.{"\n"}
            • Rôle : Importation et redistribution des articles high-tech et de mode pour le marché sénégalais.{"\n"}
            • Contact Direction : sn@jula.com / +221 33 000 00 00.
          </Text>
        </View>
                <View style={[styles.sectionCard, { backgroundColor: themeColors.bgCard }]} onLayout={(e) => capturerPosition(5, e.nativeEvent.layout.y)}>
          <Text style={[styles.sectionTitle, { color: themeColors.textMain }]}>5. Filiale Mali 🇲🇱 (Carrefour Sahélien)</Text>
          <Text style={[styles.sectionBody, { color: themeColors.textBody }]}>
            • Hub Principal : Bamako, Grand Marché et Hamdallaye.{"\n"}
            • Rôle : Acheminement rapide des marchandises depuis les ports côtiers vers le marché malien.{"\n"}
            • Contact Direction : ml@jula.com / +223 20 00 00 00.
          </Text>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: themeColors.bgCard }]} onLayout={(e) => capturerPosition(6, e.nativeEvent.layout.y)}>
          <Text style={[styles.sectionTitle, { color: themeColors.textMain }]}>6. Filiale Burkina Faso 🇧🇫 (Cœur de l'UEMOA)</Text>
          <Text style={[styles.sectionBody, { color: themeColors.textBody }]}>
            • Hub Principal : Ouagadougou (Rood-Woko) et Bobo-Dioulasso.{"\n"}
            • Rôle : Plateforme centrale de transit terrestre et de distribution commerciale au Burkina Faso.{"\n"}
            • Contact Direction : bf@jula.com / +226 25 00 00 00.
          </Text>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: themeColors.bgCard }]} onLayout={(e) => capturerPosition(7, e.nativeEvent.layout.y)}>
          <Text style={[styles.sectionTitle, { color: themeColors.textMain }]}>7. Filiale Niger 🇳🇪 (Pôle Oriental)</Text>
          <Text style={[styles.sectionBody, { color: themeColors.textBody }]}>
            • Hub Principal : Niamey, Grand Marché et Wadata.{"\n"}
            • Rôle : Desservir les commerçants et particuliers nigériens avec des délais de livraison optimisés.{"\n"}
            • Contact Direction : ne@jula.com / +227 20 00 00 00.
          </Text>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: themeColors.bgCard }]} onLayout={(e) => capturerPosition(8, e.nativeEvent.layout.y)}>
          <Text style={[styles.sectionTitle, { color: themeColors.textMain }]}>8. Filiale Bénin 🇧🇯 (Passerelle Commerciale)</Text>
          <Text style={[styles.sectionBody, { color: themeColors.textBody }]}>
            • Hub Principal : Cotonou, Marché Dantokpa.{"\n"}
            • Rôle : Distribution directe depuis les importateurs de Cotonou (Textile, électronique, pièces).{"\n"}
            • Contact Direction : bj@jula.com / +229 21 00 00 00.
          </Text>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: themeColors.bgCard }]} onLayout={(e) => capturerPosition(9, e.nativeEvent.layout.y)}>
          <Text style={[styles.sectionTitle, { color: themeColors.textMain }]}>9. Filiale Togo 🇹🇬 (Carrefour Transit)</Text>
          <Text style={[styles.sectionBody, { color: themeColors.textBody }]}>
            • Hub Principal : Lomé, Grand Marché d'Assigamé.{"\n"}
            • Rôle : Aiguillage rapide des colis pour la zone côtière et le corridor nord.{"\n"}
            • Contact Direction : tg@jula.com / +228 22 00 00 00.
          </Text>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: themeColors.bgCard, borderLeftColor: '#2e7d32' }]} onLayout={(e) => capturerPosition(10, e.nativeEvent.layout.y)}>
          <Text style={[styles.sectionTitle, { color: '#2e7d32' }]}>10. Sécurité & Protection de vos Données</Text>
          <Text style={[styles.sectionBody, { color: themeColors.textBody }]}>
            La sécurité et la confidentialité sont au cœur de Jula. Toutes les informations personnelles (adresses, numéros de téléphone et documents de vérification des marchands) sont chiffrées et protégées sur nos serveurs sécurisés. Vos coordonnées de livraison sont uniquement transmises au transporteur agréé lors de l'acheminement de votre commande.
          </Text>
        </View>

        <TouchableOpacity style={[styles.buttonClose, { backgroundColor: themeColors.btnClose }]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>← Revenir à mon Profil</Text>
        </TouchableOpacity>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, paddingTop: 40, gap: 12 },
  backButton: { padding: 2 },
  headerBarTitle: { fontSize: 18, fontWeight: 'bold' },
  header: { padding: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#f57c00' },
  headerSubtitle: { fontSize: 12, marginTop: 4 },
  scrollContainer: { padding: 12 },
  sommaireBox: { borderRadius: 8, padding: 16, marginBottom: 15, elevation: 1 },
  sommaireTitle: { fontSize: 14, fontWeight: 'bold' },
  sommaireSubtitle: { fontSize: 12, marginTop: 4, marginBottom: 15 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridButton: { width: '48%', borderWidth: 1, borderColor: '#f57c00', borderRadius: 6, padding: 10, justifyContent: 'center' },
  gridButtonText: { fontSize: 11, fontWeight: '600', color: '#f57c00', textAlign: 'center' },
  sectionDivider: { fontSize: 11, fontWeight: 'bold', color: '#7f8c8d', marginVertical: 15, paddingHorizontal: 4 },
  sectionCard: { borderRadius: 8, padding: 16, marginBottom: 15, borderLeftWidth: 5, borderLeftColor: '#f57c00', elevation: 1 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', marginBottom: 8 },
  sectionBody: { fontSize: 13, lineHeight: 20, textAlign: 'justify' },
  buttonClose: { padding: 13, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});

