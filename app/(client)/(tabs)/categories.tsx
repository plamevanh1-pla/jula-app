import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../src/context/ThemeContext';

export default function CategoriesScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  
  // Catégorie actuellement sélectionnée à gauche
  const [selectedParent, setSelectedParent] = useState('telephones');

  // Arborescence complète et officielle de Jula avec tes 14 classifications exactes
  const categoriesData: Record<string, { title: string; items: { name: string; img: string }[] }> = {
    telephones: { title: "Téléphones & Tablettes", items: [{ name: "Smartphones Android", img: "https://unsplash.com" }, { name: "iPhones (iOS)", img: "https://unsplash.com" }, { name: "Tablettes éducatives", img: "https://unsplash.com" }] },
    electronique: { title: "Électronique", items: [{ name: "Télévisions Smart", img: "https://unsplash.com" }, { name: "Enceintes & Subwoofers", img: "https://unsplash.com" }] },
    electromenager: { title: "Électroménager", items: [{ name: "Ventilateurs & Clims", img: "https://unsplash.com" }, { name: "Réfrigérateurs", img: "https://unsplash.com" }, { name: "Mixeurs & Micro-ondes", img: "https://unsplash.com" }] },
    maison: { title: "Maison & Bureau", items: [{ name: "Meubles & Salons", img: "https://unsplash.com" }, { name: "Décoration & Lumières", img: "https://unsplash.com" }] },
    informatique: { title: "Informatique", items: [{ name: "Ordinateurs PC Portables", img: "https://unsplash.com" }, { name: "MacBook Pro / Air", img: "https://unsplash.com" }, { name: "Disques durs & Clés USB", img: "https://unsplash.com" }] },
    modehomme: { title: "Mode Homme", items: [{ name: "Chaussures & Baskets", img: "https://unsplash.com" }, { name: "Chemises & Pantalons", img: "https://unsplash.com" }] },
    modefemme: { title: "Mode Femme", items: [{ name: "Robes & Ensembles", img: "https://unsplash.com" }, { name: "Sacs à main & Talons", img: "https://unsplash.com" }] },
    supermarche: { title: "Supermarché", items: [{ name: "Boissons & Jus", img: "https://unsplash.com" }, { name: "Riz, Huile & Pâtes", img: "https://unsplash.com" }] },
    beaute: { title: "Beauté & Hygiène", items: [{ name: "Parfums de marque", img: "https://unsplash.com" }, { name: "Gels & Crèmes de soins", img: "https://unsplash.com" }] },
    bebes: { title: "Produits pour bébés", items: [{ name: "Couches & Lingettes", img: "https://unsplash.com" }, { name: "Laits & Aliments bébé", img: "https://unsplash.com" }] },
    voitures: { title: "Véhicules & Auto", items: [{ name: "Voitures d'occasion", img: "https://unsplash.com" }, { name: "Motos & Scooters", img: "https://unsplash.com" }] },
    sport: { title: "Articles de Sport", items: [{ name: "Maillots de Foot", img: "https://unsplash.com" }, { name: "Ballons & Équipements", img: "https://unsplash.com" }] },
    jeuxvideo: { title: "Jeux Vidéo & Consoles", items: [{ name: "Consoles PlayStation", img: "https://unsplash.com" }, { name: "Jeux & Manettes", img: "https://unsplash.com" }] },
    traditionnel: { title: "Vêtement Traditionnel", items: [{ name: "Modèles Grand Bazin", img: "https://unsplash.com" }, { name: "Pagnes & Wax Africain", img: "https://unsplash.com" }] }
  };

  const current = categoriesData[selectedParent] || categoriesData['telephones'];

  // Palette dynamique selon le mode sombre ou clair
  const themeColors = {
    bgMain: isDarkMode ? '#111417' : '#ffffff',
    bgHeader: isDarkMode ? '#1a1d21' : '#ffffff',
    bgSearch: isDarkMode ? '#2d3139' : '#f1f3f5',
    bgLeft: isDarkMode ? '#16191d' : '#f8f9fa',
    bgTabActive: isDarkMode ? '#111417' : '#ffffff',
    bgCard: isDarkMode ? '#1a1d21' : '#ffffff',
    bgImg: isDarkMode ? '#2d3139' : '#f8f9fa',
    textMain: isDarkMode ? '#ffffff' : '#212529',
    textSub: isDarkMode ? '#adb5bd' : '#495057',
    border: isDarkMode ? '#2d3139' : '#e9ecef',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.bgMain }]}>
      {/* 🔍 Barre supérieure de recherche Style Jumia et icônes Feather */}
      <View style={[styles.header, { backgroundColor: themeColors.bgHeader, borderColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => router.push('/(client)/(tabs)/home')}>
          <Feather name="arrow-left" size={24} color={themeColors.textMain} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.searchBar, { backgroundColor: themeColors.bgSearch }]} 
          onPress={() => router.push('/(client)/(tabs)/home')}
        >
          <Feather name="search" size={18} color="#7f8c8d" />
          <Text style={styles.searchText}>Rechercher une catégorie sur Jula...</Text>
        </TouchableOpacity>
      </View>

      {/* 🗂️ ZONE DOUBLE COLONNE */}
      <View style={styles.body}>
        {/* COLONNE DE GAUCHE : Liste verticale complète des 14 classifications */}
        <View style={[styles.left, { backgroundColor: themeColors.bgLeft, borderColor: themeColors.border }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {Object.keys(categoriesData).map(key => {
              const isActive = selectedParent === key;
              return (
                <TouchableOpacity 
                  key={key} 
                  style={[
                    styles.tab, 
                    { borderColor: themeColors.border },
                    isActive && { backgroundColor: themeColors.bgTabActive }
                  ]} 
                  onPress={() => setSelectedParent(key)}
                >
                  {isActive && <View style={styles.orangeLine} />}
                  <Text style={[
                    styles.tabText, 
                    { color: themeColors.textSub },
                    isActive && styles.tabTextActive
                  ]}>
                    {categoriesData[key].title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* COLONNE DE DROITE : Grille d'affichage dynamique */}
        <View style={styles.right}>
          <ScrollView contentContainerStyle={{ padding: 12 }} showsVerticalScrollIndicator={false}>
            <Text style={[styles.rightTitle, { borderColor: themeColors.border }]}>
              {current.title}
            </Text>
            <View style={styles.grid}>
              {current.items.map((item, i) => (
                <TouchableOpacity 
                  key={i} 
                  style={[
                    styles.card, 
                    { backgroundColor: themeColors.bgCard, borderColor: themeColors.border, borderWidth: isDarkMode ? 1 : 0 }
                  ]} 
                  onPress={() => router.push({ pathname: '/(client)/(tabs)/home', params: { search: item.name } })}
                >
                  <Image source={{ uri: item.img }} style={[styles.img, { backgroundColor: themeColors.bgImg }]} />
                  <Text style={[styles.name, { color: themeColors.textMain }]} numberOfLines={2}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, gap: 12, paddingTop: 40 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 40, borderRadius: 20, gap: 8 },
  searchText: { color: '#7f8c8d', fontSize: 13 },
  body: { flex: 1, flexDirection: 'row' },
  
  // Styles colonne de gauche
  left: { width: '38%', borderRightWidth: 1 },
  tab: { paddingVertical: 16, paddingHorizontal: 8, borderBottomWidth: 1, justifyContent: 'center', position: 'relative', minHeight: 65 },
  orangeLine: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, backgroundColor: '#f57c00' },
  tabText: { fontSize: 11, fontWeight: '500', paddingLeft: 4 },
  tabTextActive: { color: '#f57c00', fontWeight: 'bold' },
  
  // Styles colonne de droite
  right: { width: '62%' },
  rightTitle: { fontSize: 14, fontWeight: 'bold', color: '#f57c00', marginBottom: 15, borderBottomWidth: 1, paddingBottom: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: { width: '46%', alignItems: 'center', marginBottom: 12, borderRadius: 6, padding: 4 },
  img: { width: '100%', height: 65, borderRadius: 6, resizeMode: 'contain' },
  name: { fontSize: 10, textAlign: 'center', marginTop: 4, fontWeight: '500', height: 28, lineHeight: 14 }
});
