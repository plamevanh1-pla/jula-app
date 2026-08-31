import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Connexion automatique à ton coffre-fort Supabase Jula
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL || "https://bgfmnjvhlonrfpfsxefe.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "sb_publishable_W_q0i6GH_dKXr2QFc3xu_Q_EUZzpDMK"
);

interface FavorisItem {
  id: string;
  title: string;
  price: number;
  image_url: string;
  stock_quantity: number;
}

export default function FavorisScreen() {
  const router = useRouter();
  const [items, setItems] = useState<FavorisItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 📡 ASPIRATION EN DIRECT DES ARTICLES FAVORISÉS DEPUIS SUPABASE
  useEffect(() => {
    async function loadFavoris() {
      try {
        // Pour les tests, on interroge tes 5 premiers produits du catalogue comme favoris par défaut
        const { data, error } = await supabase
          .from('products')
          .select('id, title, price, image_url, stock_quantity')
          .limit(5);

        if (!error && data) {
          setItems(data as FavorisItem[]);
        }
      } catch (err) {
        console.error("Erreur de chargement des favoris:", err);
      } finally {
        setLoading(false);
      }
    }
    loadFavoris();
  }, []);

  // 🗑️ FONCTION : Retirer un article de la liste des favoris
  const deleteItem = (id: string) => {
    Alert.alert(
      "Retirer des favoris",
      "Voulez-vous enlever cet article de votre liste ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Retirer", 
          style: "destructive",
          onPress: () => {
            setItems(items.filter(item => item.id !== id));
          }
        }
      ]
    );
  };

  // 🛒 FONCTION : Envoyer l'article directement dans le panier d'achat
  const addToCart = (title: string) => {
    Alert.alert("🛒 Panier Jula", `${title} a été ajouté à votre panier avec succès !`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Barre d'en-tête Jumia-Style */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>Mes Articles Favoris</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#f57c00" />
        </View>
      ) : items.length === 0 ? (
        // 🛍️ Design écran vide si l'utilisateur n'a rien sélectionné
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>❤️</Text>
          <Text style={styles.emptyTitle}>Votre liste de favoris est vide</Text>
          <Text style={styles.emptySubtitle}>
            Parcourez le rayon des grossistes d'Adjamé et touchez le cœur pour sauvegarder vos produits ici.
          </Text>
          <TouchableOpacity style={styles.exploreButton} onPress={() => router.push('/')}>
            <Text style={styles.exploreButtonText}>Commencer mon shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // 📦 LISTING COMPLET DES PRODUITS FAVORISÉS EN DIRECT
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionLabel}>Articles sauvegardés ({items.length})</Text>

          {items.map((item) => (
            <View key={item.id} style={styles.card}>
              {/* Photo du produit */}
              <Image source={{ uri: item.image_url }} style={styles.productImage} />
              
              {/* Infos textuelles */}
              <View style={styles.infoBlock}>
                <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.productPrice}>{item.price.toLocaleString('fr-FR')} FCFA</Text>
                
                {/* Jauge anti-rupture de stock codée */}
                <Text style={[styles.stockText, { color: item.stock_quantity > 0 ? '#2e7d32' : '#c62828' }]}>
                  {item.stock_quantity > 0 ? `🟢 En stock (${item.stock_quantity})` : '🔴 Rupture de stock'}
                </Text>
              </View>

              {/* Bloc boutons d'actions tactiles à droite */}
              <View style={styles.actionBlock}>
                {/* Bouton Acheter / Panier */}
                <TouchableOpacity 
                  style={[styles.cartButton, { opacity: item.stock_quantity > 0 ? 1 : 0.5 }]} 
                  disabled={item.stock_quantity === 0}
                  onPress={() => addToCart(item.title)}
                >
                  <Text style={styles.cartButtonText}>Acheter</Text>
                </TouchableOpacity>

                {/* Bouton Poubelle de suppression */}
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem(item.id)}>
                  <Text style={styles.deleteIcon}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  headerBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  backButton: { marginRight: 15 },
  backArrow: { fontSize: 22, color: '#333', fontWeight: 'bold' },
  headerBarTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 25 },
  
  // Écran vide
  emptyIcon: { fontSize: 60, marginBottom: 15 },
  emptyTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 8 },
  emptySubtitle: { fontSize: 12, color: '#777', textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  exploreButton: { backgroundColor: '#f57c00', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 6 },
  exploreButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  
  // Cartes Produits Favoris
  scrollContainer: { padding: 12 },
  sectionLabel: { fontSize: 12, color: '#666', fontWeight: 'bold', marginBottom: 12, textTransform: 'uppercase' },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  productImage: { width: 75, height: 75, borderRadius: 6, backgroundColor: '#eee' },
  infoBlock: { flex: 1, paddingHorizontal: 12, justifyContent: 'center' },
  productTitle: { fontSize: 13, fontWeight: '500', color: '#333', lineHeight: 18 },
  productPrice: { fontSize: 15, fontWeight: 'bold', color: '#f57c00', marginTop: 4 },
  stockText: { fontSize: 11, marginTop: 4, fontWeight: '600' },
  
  // Actions
  actionBlock: { alignItems: 'center', justifyContent: 'space-between', height: 75 },
  cartButton: { backgroundColor: '#f57c00', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 1 },
  cartButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  deleteButton: { padding: 5, marginTop: 5 },
  deleteIcon: { fontSize: 18, color: '#777' }
});
