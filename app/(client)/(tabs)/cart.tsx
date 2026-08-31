import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../../src/config/supabaseClient';
interface CartItem {
  id: string;
  title: string;
  price: number;
  promo_price?: number;
  image_url: string;
  category: string;
  quantite: number; // Gestion de la quantité en gros Jula
}

export default function CartScreen() {
  const router = useRouter();
  
  // 🛒 Tableau dynamique contenant de vrais articles de production
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'iphone-demo-id',
      title: 'iPhone Pro Max 250 G',
      price: 450000,
      promo_price: 350000, // Gère le prix barré Jumia-Style
      image_url: 'https://unsplash.com',
      category: 'Électronique',
      quantite: 1
    }
  ]); 
  
  const [recoProducts, setRecoProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [menuVisible, setMenuVisible] = useState(false); 
  const [userCountry, setUserCountry] = useState('Côte d\'Ivoire');

  const categoriesPopulaires = [
    "👕 Vêtement", "⌚ Montre", "👜 Sac", "👔 Vêtement Homme", 
    "📚 Scolaire & Fournitures", "⚽ Sports & Plein air", 
    "🔌 Électroménagers", "💍 Bijoux & Accessoires", "🚗 Automobiles & Deux roues"
  ];

   // 📡 LIEN DIRECT AVEC LA MEMOIRE FLASH POUR UN CHARGEMENT ULTRA-RAPIDE
useEffect(() => {
 async function chargerPanierFlash() {
  try {
   const donnéesPanier = await AsyncStorage.getItem('jula_panier');
      if (donnéesPanier) {
        setCartItems(JSON.parse(donnéesPanier));
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.log("Erreur de lecture du panier flash");
    }
  }
  chargerPanierFlash();
  fetchRecommendations();
}, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*').limit(6);
      if (data && !error) setRecoProducts(data);
    } catch (err: any) { console.log(err.message); } finally { setLoading(false); }
  };

  // 🎛️ MODIFICATEUR DE QUANTITÉ DYNAMIQUE ([+] et [-])
  const ajusterQuantite = (id: string, action: 'plus' | 'moins') => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const nouvelleQte = action === 'plus' ? item.quantite + 1 : Math.max(1, item.quantite - 1);
        return { ...item, quantite: nouvelleQte };
      }
      return item;
    }));
  };

     // 🗑️ NETTOYAGE CHIRURGICAL ET INSTANTANÉ DE LA MÉMOIRE FLASH DU TELEPHONE
  const supprimerDuPanier = async (id: string, title: string) => {
  try {
    // 1. On calcule la nouvelle liste en retirant le produit sélectionné
    const nouvelleListe = cartItems.filter(item => item.id !== id);
    
    // 2. On met à jour l'écran visuel du Tecno instantanément
    setCartItems(nouvelleListe);
    
    // 3. FORCE LE NETTOYAGE EN MÉMOIRE FLASH : On écrase l'ancien stockage
    await AsyncStorage.setItem('jula_panier', JSON.stringify(nouvelleListe));
    
    Alert.alert("🛒 Panier Jula", `"${title}" a été retiré et effacé de la mémoire avec succès !`);
  } catch (err) {
    Alert.alert("❌ Erreur", "Impossible de synchroniser le retrait du produit.");
  }
};
   // ❤️ BASCULE SÉCURISÉE VERS LES FAVORIS EN NETTOYANT LE STOCKAGE DU PANIER
  const deplacerVersFavoris = async (item: any) => {
  try {
    const nouvelleListe = cartItems.filter(i => i.id !== item.id);
    setCartItems(nouvelleListe);
    
    // Écrase le stockage local pour libérer la place
    await AsyncStorage.setItem('jula_panier', JSON.stringify(nouvelleListe));
    
    Alert.alert("❤️ Favoris Jula", `"${item.title}" a été basculé dans vos Favoris !`);
  } catch (err) {
    console.log("Erreur de bascule favoris");
  }
};
  const filteredProducts = recoProducts.filter(p => 
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  // Moteur de calcul financier instantané (Prix promo prioritaire si disponible)
  const sousTotal = cartItems.reduce((sum, item) => sum + ((item.promo_price || item.price) * item.quantite), 0);
  const fraisLivraison = cartItems.length > 0 ? 1500 : 0;
  const totalGeneral = sousTotal + fraisLivraison;
  return (
    <SafeAreaView style={styles.container}>
      {/* 🔍 BARRE SUPÉRIEURE UNIFORME JULA */}
      <View style={styles.searchBarContainer}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}><Ionicons name="menu-outline" size={26} color="#212529" /></TouchableOpacity>
        <View style={styles.searchField}>
          <Ionicons name="search-outline" size={18} color="#6c757d" />
          <TextInput style={styles.searchInput} placeholder="Jula" placeholderTextColor="#f57c00" value={search} onChangeText={setSearch} />
        </View>
        <TouchableOpacity onPress={() => router.push('/(client)/(tabs)/profile')}><Ionicons name="person-outline" size={24} color="#212529" /></TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.mainTitle}>Panier</Text>

        {/* 1️⃣ STRUCTURE DU PANIER VIDE : AVEC LE BOUTON RETOUR HOME */}
        {cartItems.length === 0 && (
          <View style={styles.emptyContainer}>
            <View style={styles.imageBox}>
              <Ionicons name="basket" size={80} color="#f57c00" />
              <View style={styles.orangeBadge}><Text style={styles.badgeText}>0</Text></View>
            </View>
            <Text style={styles.emptyTitle}>Votre panier est vide</Text>
            
            {/* 🔄 RECONNEXION SÉCURISÉE VERS L'ACCUEIL */}
            <TouchableOpacity style={styles.btnBrowse} onPress={() => router.push('/(client)/(tabs)')}>
              <Text style={styles.btnBrowseText}>🏠 Parcourir les articles</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 2️⃣ STRUCTURE ACTIVE DU PANIER JULA AVEC CONTROLE DE QUANTITÉ EN GROS */}
        {cartItems.length > 0 && (
          <View style={{ paddingHorizontal: 16 }}>
            {/* RÉSUMÉ FINANCIER DU HAUT (PRIX TRANSPARENT) */}
            <View style={styles.topSummaryCard}>
              <Text style={styles.topSummaryLabel}>SOUS-TOTAL :</Text>
              <Text style={styles.topSummaryValue}>{sousTotal.toLocaleString('fr-FR')} FCFA</Text>
            </View>

            {cartItems.map((item) => (
              <View key={item.id} style={styles.cartCard}>
                <Image source={{ uri: item.image_url }} style={styles.cartProductImg} />
                
                <View style={styles.cartProductInfo}>
                  <Text style={styles.cartProductTitle} numberOfLines={1}>{item.title}</Text>
                  
                  {/* Affichage des prix d'usine et réductions barrées */}
                  {item.promo_price ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                      <Text style={styles.cartProductPrice}>{item.promo_price.toLocaleString('fr-FR')} FCFA</Text>
                      <Text style={styles.cartProductOldPrice}>{item.price.toLocaleString('fr-FR')} XOF</Text>
                    </View>
                  ) : (
                    <Text style={styles.cartProductPrice}>{item.price.toLocaleString('fr-FR')} FCFA</Text>
                  )}

                  {/* INTERFACES DE COMMANDE : ACTIONS FAVORIS ET RETRAIT */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.favButton} onPress={() => deplacerVersFavoris(item)}>
                      <Text style={styles.favButtonText}>❤️ Favoris</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => supprimerDuPanier(item.id, item.title)}>
                      <Text style={styles.deleteButtonText}>🗑️ Retirer</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 🎛️ SÉLECTEUR DE QUANTITÉ INTERACTIF CÔTÉ DROIT ([+] et [-]) */}
                <View style={styles.quantityContainer}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => ajusterQuantite(item.id, 'plus')}>
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyValueText}>{item.quantite}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={() => ajusterQuantite(item.id, 'moins')}>
                    <Text style={styles.qtyBtnText}>-</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* FACTURE COMMERCIALE JULA PAY DE ZONE UEMOA */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>🧾 Résumé de votre facture</Text>
              <View style={styles.summaryLine}><Text style={styles.summaryLabel}>Articles commandés :</Text><Text style={styles.summaryValue}>{sousTotal.toLocaleString('fr-FR')} FCFA</Text></View>
              <View style={styles.summaryLine}><Text style={styles.summaryLabel}>Livraison Jula Express :</Text><Text style={styles.summaryValue}>{fraisLivraison.toLocaleString('fr-FR')} FCFA</Text></View>
              <View style={[styles.summaryLine, { borderTopWidth: 1, borderColor: '#f1f3f5', paddingTop: 8, marginTop: 8 }]}>
                <Text style={[styles.summaryLabel, { fontWeight: 'bold', color: '#212529' }]}>Montant Total :</Text>
                <Text style={{ color: '#f57c00', fontWeight: 'bold', fontSize: 15 }}>{totalGeneral.toLocaleString('fr-FR')} FCFA</Text>
              </View>
            </View>

            {/* GROS BOUTON ORANGE TRANSACTIONNEL DE PRODUCTION CONNECTÉ */}
            <TouchableOpacity style={styles.checkoutButton} onPress={() => Alert.alert("💳 Jula Pay", "Traitement de votre facture en cours via PayDunya...")}>
              <Text style={styles.checkoutButtonText}>💳 Passer la commande ({totalGeneral.toLocaleString('fr-FR')} F)</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* RECOMMANDATIONS DE BAS DE PAGE */}
        <View style={styles.recoSection}>
          <Text style={styles.recoHeader}>Vous aimerez aussi</Text>
          {loading ? <ActivityIndicator size="small" color="#f57c00" /> : filteredProducts.length === 0 ? (
            <Text style={styles.noResultTxt}>Aucun article ne correspond à votre recherche.</Text>
          ) : (
            <View style={styles.recoGrid}>
              {filteredProducts.map(item => (
                <TouchableOpacity key={item.id} style={styles.recoCard} onPress={() => router.push(`/product/${item.id}`)}>
                  <Image source={{ uri: item.image_url || 'https://unsplash.com' }} style={styles.recoImg} />
                  <View style={styles.recoInfo}>
                    <Text style={styles.recoTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.recoPrice}>{item.price ? item.price.toLocaleString('fr-FR') : '0'} FCFA</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* 📋 MENU TIROIR VOLANT STYLE ALIEXPRESS */}
      <Modal animationType="slide" transparent={true} visible={menuVisible} onRequestClose={() => setMenuVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.drawerContainer}>
            <View style={styles.drawerHeader}>
              <TouchableOpacity onPress={() => { setMenuVisible(false); router.push('/(client)/(tabs)'); }}><Ionicons name="home" size={24} color="#f57c00" /></TouchableOpacity>
              <Text style={styles.drawerBrand}>Jula</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)}><Ionicons name="close" size={24} color="#7f8c8d" /></TouchableOpacity>
            </View>
            <Text style={styles.drawerSectionTitle}>🔥 Catégories Populaires</Text>
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
              {categoriesPopulaires.map((cat, idx) => (
                <TouchableOpacity key={idx} style={styles.drawerItemRow} onPress={() => { setMenuVisible(false); router.push('/(client)/(tabs)/categories'); }}>
                  <Text style={{ fontSize: 14, color: '#212529', fontWeight: '500' }}>{cat}</Text>
                  <Ionicons name="chevron-forward" size={14} color="#c7c7cc" />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.drawerFooter}>
              <Ionicons name="planet-outline" size={18} color="#7f8c8d" />
              <Text style={{ fontSize: 13, color: '#7f8c8d' }}>Livré à : <Text style={{ fontWeight: 'bold', color: '#212529' }}>{userCountry}</Text></Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
   container: { flex: 1, backgroundColor: '#f4f4f6' },
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e9ecef', gap: 14, paddingTop: 40 },
  searchField: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f3f5', borderRadius: 20, paddingHorizontal: 16, height: 38, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#212529', fontWeight: 'bold' },
  mainTitle: { fontSize: 22, fontWeight: 'bold', color: '#212529', marginLeft: 16, marginTop: 16, marginBottom: 10 },
  emptyContainer: { backgroundColor: '#fff', alignItems: 'center', paddingVertical: 40, marginHorizontal: 16, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#e9ecef' },
  imageBox: { position: 'relative', width: 100, alignItems: 'center', justifyContent: 'center' },
  orangeBadge: { position: 'absolute', top: 5, right: 15, backgroundColor: '#f57c00', width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#212529', marginTop: 15, marginBottom: 20 },
  btnBrowse: { backgroundColor: '#f57c00', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  btnBrowseText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  topSummaryCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#e9ecef', alignItems: 'center' },
  topSummaryLabel: { fontSize: 12, fontWeight: 'bold', color: '#7f8c8d', letterSpacing: 0.5 },
  topSummaryValue: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  cartCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: '#eee', alignItems: 'center' },
  cartProductImg: { width: 80, height: 80, borderRadius: 6, backgroundColor: '#f8f9fa', resizeMode: 'cover' },
  cartProductInfo: { flex: 1, paddingLeft: 12, height: 80, justifyContent: 'space-between' },
  cartProductTitle: { fontSize: 14, fontWeight: 'bold', color: '#212529' },
  cartProductPrice: { fontSize: 14, fontWeight: 'bold', color: '#f57c00' },
  cartProductOldPrice: { fontSize: 11, color: '#999', textDecorationLine: 'line-through', marginLeft: 8 },
  actionRow: { flexDirection: 'row', marginTop: 4 },
  favButton: { borderWidth: 1, borderColor: '#1072ba', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 4, marginRight: 8 },
  favButtonText: { color: '#1072ba', fontSize: 11, fontWeight: 'bold' },
  deleteButton: { borderWidth: 1, borderColor: '#d32f2f', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 4 },
  deleteButtonText: { color: '#d32f2f', fontSize: 11, fontWeight: 'bold' },
  quantityContainer: { alignItems: 'center', justifyContent: 'center', width: 35, gap: 5, paddingLeft: 5 },
  qtyBtn: { backgroundColor: '#fdf2e9', width: 26, height: 26, borderRadius: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#f57c00' },
  qtyBtnText: { color: '#f57c00', fontSize: 14, fontWeight: 'bold' },
  qtyValueText: { fontSize: 14, fontWeight: 'bold', color: '#212529', marginVertical: 2 },
  summaryCard: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginTop: 10, borderWidth: 1, borderColor: '#eee' },
  summaryTitle: { fontSize: 13, fontWeight: 'bold', color: '#212529', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f1f3f5', paddingBottom: 4 },
  summaryLine: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 },
  summaryLabel: { fontSize: 12, color: '#6c757d' },
  summaryValue: { fontSize: 12, fontWeight: '600', color: '#212529' },
  checkoutButton: { backgroundColor: '#f57c00', padding: 15, borderRadius: 25, alignItems: 'center', marginTop: 15, marginBottom: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3, elevation: 3 },
  checkoutButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14, textTransform: 'uppercase' },
  recoSection: { paddingHorizontal: 16, marginBottom: 30, marginTop: 15 },
  recoHeader: { fontSize: 16, fontWeight: 'bold', color: '#212529', marginBottom: 12 },
  recoGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  recoCard: { backgroundColor: '#fff', width: '48%', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e9ecef', marginBottom: 10 },
  recoImg: { width: '100%', height: 120, resizeMode: 'cover', backgroundColor: '#f8f9fa' },
  recoInfo: { padding: 8 },
  recoTitle: { fontSize: 12, color: '#495057' },
  recoPrice: { fontSize: 13, fontWeight: 'bold', color: '#f57c00', marginTop: 4 },
  noResultTxt: { textAlign: 'center', color: '#7f8c8d', fontSize: 13, marginTop: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  drawerContainer: { backgroundColor: '#fff', width: '80%', height: '100%', padding: 20, alignSelf: 'flex-start' },
  drawerHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderColor: '#e9ecef', paddingBottom: 15, marginBottom: 15 },
  drawerBrand: { fontSize: 20, fontWeight: 'bold', color: '#f57c00' },
  drawerSectionTitle: { fontSize: 12, color: '#7f8c8d', fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase' },
  drawerItemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#f8f9fa' },
  drawerFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, borderTopWidth: 1, borderColor: '#e9ecef', paddingTop: 15, marginTop: 15 }
});