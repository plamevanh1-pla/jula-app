import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../../src/context/CartContext';

export default function FavoritesScreen() {
  const router = useRouter();
  const { addToCart } = useCart();
  
  // Simulation locale d'articles favoris mis de côté par le client
  const [favorites, setFavorites] = useState<any[]>([
    {
      id: '1',
      name: 'Smartphone Android Jula Pro',
      price: 85000,
      image_url: 'https://unsplash.com',
      category: 'Électronique'
    }
  ]);

  const handleRemoveFavorite = (id: string) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  const handleMoveToCart = (item: any) => {
    addToCart(item);
    Alert.alert("Panier mis à jour", `${item.name} a été déplacé dans votre panier.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête de page complète */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>⬅ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes Favoris</Text>
        <View style={{ width: 60 }} />
      </View>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Votre liste de favoris est vide.</Text>
            <TouchableOpacity style={styles.shopButton} onPress={() => router.push('/(client)/(tabs)/home')}>
              <Text style={styles.shopButtonText}>Parcourir la boutique</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.favoriteCard}>
            <Image source={{ uri: item.image_url }} style={styles.productImage} />
            
            <View style={styles.productDetails}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.productCategory}>{item.category.toUpperCase()}</Text>
                <TouchableOpacity onPress={() => handleRemoveFavorite(item.id)}>
                  <Text style={styles.deleteIcon}>❌</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.productPrice}>{item.price.toLocaleString()} FCFA</Text>
              
              <TouchableOpacity style={styles.addToCartButton} onPress={() => handleMoveToCart(item)}>
                <Text style={styles.addToCartText}>Ajouter au panier</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#dee2e6' },
  backButton: { padding: 4 },
  backText: { fontSize: 15, color: '#f57c00', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  listContainer: { padding: 16 },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontSize: 15, color: '#6c757d', marginBottom: 16 },
  shopButton: { backgroundColor: '#fff3e0', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#f57c00' },
  shopButtonText: { color: '#f57c00', fontWeight: 'bold', fontSize: 14 },
  favoriteCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 16, elevation: 1 },
  productImage: { width: 90, height: 90, borderRadius: 6, resizeMode: 'cover' },
  productDetails: { flex: 1, marginLeft: 16, justifyContent: 'space-between' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  productCategory: { fontSize: 11, color: '#adb5bd', fontWeight: 'bold' },
  deleteIcon: { fontSize: 14, padding: 2 },
  productName: { fontSize: 15, fontWeight: '500', color: '#212529', marginTop: 2 },
  productPrice: { fontSize: 15, fontWeight: 'bold', color: '#e65100', marginTop: 2 },
  addToCartButton: { backgroundColor: '#f57c00', paddingVertical: 8, borderRadius: 6, alignItems: 'center', marginTop: 8 },
  addToCartText: { color: '#fff', fontSize: 13, fontWeight: 'bold' }
});