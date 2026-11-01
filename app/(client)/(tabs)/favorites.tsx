  import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

interface SmartphoneItem {
  id: string;
  title: string;
  price: string;
  image_url: string;
  seller_name: string;
  hub_city: string;
}

export default function FavoritesScreen() {
  const { isDarkMode } = useTheme();
  const [favorites, setFavorites] = useState<SmartphoneItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger la liste réelle des favoris depuis le stockage local du téléphone
  const loadFavorites = async () => {
    try {
      setIsLoading(true);
      const savedFavs = await AsyncStorage.getItem('JULA_USER_FAVORITES');
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      }
    } catch (error) {
      console.error("Erreur de lecture des favoris", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  // Supprimer un smartphone de la liste avec le coeur brisé ou la croix en un clic
  const removeFavorite = async (id: string) => {
    const updatedFavs = favorites.filter(item => item.id !== id);
    setFavorites(updatedFavs);
    await AsyncStorage.setItem('JULA_USER_FAVORITES', JSON.stringify(updatedFavs));
  };

  const currentStyles = isDarkMode ? darkTheme : lightTheme;

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, currentStyles.bg]}>
        <View style={styles.centerBlock}>
          <ActivityIndicator size="large" color="#f57c00" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, currentStyles.bg]}>
      {/* En-tête de la page */}
      <View style={[styles.header, currentStyles.borderBottom]}>
        <Text style={[styles.headerTitle, currentStyles.textMain]}>Mes Favoris ❤️</Text>
        <Text style={styles.headerSubtitle}>Retrouvez les smartphones qui vous intéressent en zone CFA</Text>
      </View>

      {favorites.length === 0 ? (
        /* ÉTAT VIDE : Si l'acheteur n'a encore rien enregistré */
        <View style={styles.centerBlock}>
          <Text style={styles.iconEmpty}>💔</Text>
          <Text style={[styles.textEmpty, currentStyles.textMain]}>Aucun favori pour le moment</Text>
          <p style={styles.subTextEmpty}>Parcourez le catalogue général Jula et cliquez sur le cœur pour ajouter un téléphone ici.</p>
        </View>
      ) : (
        /* GRILLE DE SMARTPHONES RÉELLE INTERACTIVE */
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          paddingHorizontal={16}
          paddingTop={10}
          renderItem={({ item }) => (
            <View style={[styles.card, currentStyles.cardBg, currentStyles.border]}>
              <Image source={{ uri: item.image_url || 'https://placeholder.com' }} style={styles.productImage} />
              
              <View style={styles.infoContainer}>
                <Text style={[styles.productTitle, currentStyles.textMain]} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.sellerText}>🏬 {item.seller_name || 'Grossiste Jula'}</Text>
                <Text style={styles.cityText}>📍 {item.hub_city || 'Abidjan - Dakar'}</Text>
                <Text style={styles.productPrice}>{item.price} FCFA</Text>
              </View>

              {/* Bouton de suppression rapide */}
              <TouchableOpacity style={styles.btnRemove} onPress={() => removeFavorite(item.id)}>
                <Text style={styles.btnRemoveText}>×</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

// 🎨 DESIGN SYSTEM COMPATIBLE TECNO POP 9
const styles = StyleSheet.create({
  container: { flex: 1 },
  centerBlock: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  header: { padding: 20, paddingTop: 10 },
  headerTitle: { fontSize: 24, fontWeight: '800', letterSpacing: 0.5 },
  headerSubtitle: { fontSize: 13, color: '#7f8c8d', marginTop: 4 },
  
  // Design des fiches produits de favoris
  card: { flexDirection: 'row', borderRadius: 8, padding: 12, marginBottom: 14, alignItems: 'center', position: 'relative', elevation: 2 },
  productImage: { width: 80, height: 80, borderRadius: 6, backgroundColor: '#2d2d2d' },
  infoContainer: { flex: 1, marginLeft: 14, justifyContent: 'center' },
  productTitle: { fontSize: 16, fontWeight: 'bold' },
  sellerText: { fontSize: 12, color: '#7f8c8d', marginTop: 2 },
  cityText: { fontSize: 12, color: '#7f8c8d' },
  productPrice: { fontSize: 17, fontWeight: '900', color: '#f57c00', marginTop: 4 },
  
  // Croix rouge de retrait rapide
  btnRemove: { position: 'absolute', top: 10, right: 10, width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(229,57,53,0.1)', alignItems: 'center', justifyContent: 'center' },
  btnRemoveText: { color: '#e53935', fontSize: 16, fontWeight: 'bold' },
  
  // Vue vide
  iconEmpty: { fontSize: 44, marginBottom: 10 },
  textEmpty: { fontSize: 18, fontWeight: 'bold' },
  subTextEmpty: { color: '#7f8c8d', fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 18 }
});

// 🌗 THEMATISATION COMMUTABLE EN UN CLIC SECURISE
const lightTheme = StyleSheet.create({
  bg: { backgroundColor: '#f8f9fa' },
  cardBg: { backgroundColor: '#ffffff' },
  textMain: { color: '#212529' },
  border: { borderWidth: 1, borderColor: '#dee2e6' },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: '#dee2e6' }
});

const darkTheme = StyleSheet.create({
  bg: { backgroundColor: '#111417' },
  cardBg: { backgroundColor: '#1a1d21' },
  textMain: { color: '#ffffff' },
  border: { borderWidth: 1, borderColor: '#2d3139' },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: '#2d3139' }
});
