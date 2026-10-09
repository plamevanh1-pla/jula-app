 import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../../src/config/supabaseClient';
import { useTheme } from '../../../src/context/ThemeContext'; // 🟢 INJECTION DE LA LUMIÈRE JULA

export default function HomeScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme(); // 🌓 INTERCEPTEUR CLAIR/SOMBRE AUTOMATIQUE
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ad, setAd] = useState<any>(null);
  const [isAdVisible, setIsAdVisible] = useState(false); // ❌ Gestion de l'ouverture de la Pop-up

  const [selectedCategoryKeyword, setSelectedCategoryKeyword] = useState<string>('');
  const [countryFilter, setCountryFilter] = useState<string>('CI');

  const topCategories = [
    { id: '0', title: '🔄 Tout Voir', keyword: '' },
    { id: '1', title: '📱 Téléphones', keyword: 'phone' },
    { id: '2', title: '💻 Informatique', keyword: 'ordinateur' },
    { id: '3', title: '🎮 Jeux Vidéo', keyword: 'console' },
    { id: '4', title: '🚗 Véhicules', keyword: 'voiture' },
    { id: '5', title: '⚽ Sport', keyword: 'sport' },
    { id: '6', title: '🔌 Électronique', keyword: 'elect' }
  ];

  useEffect(() => {
    async function initHome() {
      const pays = await AsyncStorage.getItem('jula_pays_choisi') || 'CI';
      setCountryFilter(pays);
      fetchProducts(pays);
      fetchActiveAd();
    }
    initHome();
  }, []);

  const fetchProducts = async (paysId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('country', paysId)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) setProducts(data);
    } catch (err: any) {
      console.log("Erreur produits Jula filtrés:", err.message);
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (data) setProducts(data);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveAd = async () => {
    try {
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .eq('is_active', true)
        .limit(1)
        .single();
      if (!error && data) {
        setAd(data);
        setIsAdVisible(true); // 🚀 Ouvre automatiquement la Pop-up au lancement !
      }
    } catch (err) {
      console.log("Pas de publicité active ou erreur:", err);
    }
  };

  const getProductsByCategory = (categoryKeyword: string) => {
    return products.filter(p => {
      return p.category?.toLowerCase().includes(categoryKeyword.toLowerCase()) ||
             p.title?.toLowerCase().includes(categoryKeyword.toLowerCase());
    });
  };

  const searchedProducts = products.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategoryKeyword !== '' ? (
      p.category?.toLowerCase().includes(selectedCategoryKeyword.toLowerCase()) ||
      p.title?.toLowerCase().includes(selectedCategoryKeyword.toLowerCase())
    ) : true;
    return matchesSearch && matchesCategory;
  });

  const renderProductRow = (title: string, categoryKeyword: string, backgroundColor: string) => {
    if (selectedCategoryKeyword !== '' && !categoryKeyword.toLowerCase().includes(selectedCategoryKeyword.toLowerCase())) {
      return null;
    }
    const list = getProductsByCategory(categoryKeyword);
    if (list.length === 0) return null;

    return (
      <View style={styles.sectionContainer}>
        <View style={[styles.sectionHeaderRow, { backgroundColor }]}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <TouchableOpacity onPress={() => router.push('/(client)/categories')}>
            <Text style={styles.seeAllText}>Voir Tout</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalProductScroll}>
          {list.map((item) => {
            let remiseRow = 0;
            if (item.price && item.promo_price && item.price > item.promo_price) {
              remiseRow = Math.round(((item.price - item.promo_price) / item.price) * 100);
            }
            return (
              <TouchableOpacity key={item.id} style={[styles.productCardHorizontal, { backgroundColor: isDarkMode ? '#1a1d21' : '#fff', borderColor: isDarkMode ? '#2d3139' : '#eee' }]} onPress={() => router.push(`/product/${item.id}`)}>
                <View style={{ position: 'relative' }}>
                  <Image source={{ uri: item.image_url || 'https://unsplash.com' }} style={styles.productImgHorizontal} />
                  {remiseRow > 0 && (
                    <View style={styles.miniPromoBadge}><Text style={styles.miniPromoBadgeText}>-{remiseRow}%</Text></View>
                  )}
                </View>
                <View style={styles.productInfoHorizontal}>
                  <Text style={[styles.prodTitleHorizontal, { color: isDarkMode ? '#fff' : '#212529' }]} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.prodPriceHorizontal}>{(item.promo_price || item.price).toLocaleString('fr-FR')} F</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#111417' : '#f4f4f6' }]}>
      
      {/* ❌ 1. FENÊTRE POP-UP PUBLICITAIRE INTELLIGENTE AVEC BOUTON CROIX */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isAdVisible}
        onRequestClose={() => setIsAdVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: isDarkMode ? '#1a1d21' : '#fff', borderColor: isDarkMode ? '#2d3139' : '#eee' }]}>
            
            {/* 🎯 LA CROIX DE FERMETURE EN HAUT À DROITE */}
            <TouchableOpacity 
              style={styles.closeAdButton} 
              onPress={() => setIsAdVisible(false)}
            >
              <Feather name="x-circle" size={26} color="#f57c00" />
            </TouchableOpacity>

            {ad && (
              <View style={{ width: '100%' }}>
                <Text style={[styles.modalAdBadge, { color: isDarkMode ? '#fff' : '#212529' }]}>🔥 OFFRE EXCLUSIVE JULA</Text>
                <Image source={{ uri: ad.image_url }} style={styles.modalAdImage} />
                <Text style={[styles.modalAdTitle, { color: isDarkMode ? '#fff' : '#212529' }]}>{ad.title}</Text>
                
                <TouchableOpacity 
                  style={styles.modalActionButton} 
                  onPress={() => {
                    setIsAdVisible(false);
                    router.push('/(client)/categories');
                  }}
                >
                  <Text style={styles.modalActionButtonText}>Profiter de l'offre maintenant ➔</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* 🔍 EN-TÊTE ET BARRE DE RECHERCHE CLIENT */}
      <View style={[styles.searchBarContainer, { backgroundColor: isDarkMode ? '#1a1d21' : '#fff', borderColor: isDarkMode ? '#2d3139' : '#e9ecef' }]}>
        <View style={[styles.searchField, { backgroundColor: isDarkMode ? '#111417' : '#f1f3f5' }]}>
          <Feather name="search" size={18} color="#6c757d" />
          <TextInput 
            style={[styles.searchInput, { color: isDarkMode ? '#fff' : '#212529' }]} 
            placeholder="Rechercher sur Jula..." 
            placeholderTextColor="#7f8c8d"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.cartIconBtn} onPress={() => router.push('/(client)/(tabs)/cart')}>
          <Feather name="shopping-cart" size={22} color="#f57c00" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* BANNIÈRE COMMERCIALE UNIVERSELLE */}
        <View style={[styles.banner, { backgroundColor: isDarkMode ? '#1a1d21' : '#fff', borderColor: isDarkMode ? '#2d3139' : '#eee' }]}>
          <Text style={styles.bannerTitle}>🎉 Jula E-Commerce</Text>
          <Text style={styles.bannerSub}>Réseau interconnecté • 4 Pays de la Zone CFA</Text>
        </View>

        {/* COMPARTIMENT HORIZONTAL DES CATÉGORIES INTERACTIVES */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.topCategoriesScroll, { backgroundColor: isDarkMode ? '#1a1d21' : '#fff' }]}>
          {topCategories.map((cat) => {
            const isSelected = selectedCategoryKeyword === cat.keyword;
            return (
              <TouchableOpacity 
                key={cat.id} 
                style={[styles.topCatBadge, { backgroundColor: isDarkMode ? '#111417' : '#f1f3f5', borderColor: isDarkMode ? '#2d3139' : '#e9ecef' }, isSelected ? { backgroundColor: '#f57c00', borderColor: '#f57c00' } : null]} 
                onPress={() => setSelectedCategoryKeyword(cat.keyword)}
              >
                <Text style={[styles.topCatText, { color: isDarkMode ? '#95a5a6' : '#495057' }, isSelected ? { color: '#fff', fontWeight: 'bold' } : null]}>{cat.title}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {loading ? (
          <ActivityIndicator size="large" color="#f57c00" style={{ marginTop: 40 }} />
        ) : (search.length > 0 || selectedCategoryKeyword !== '') ? (
          <View style={styles.searchResultsContainer}>
            <Text style={[styles.searchResultsTitle, { color: isDarkMode ? '#fff' : '#212529' }]}>Articles correspondants ({searchedProducts.length})</Text>
            {searchedProducts.length === 0 ? (
              <Text style={styles.noResultsTxt}>❌ Aucun article ne correspond à votre recherche.</Text>
            ) : (
              <View style={styles.jumiaGrid}>
                {searchedProducts.map(item => {
                  let remiseGrid = 0;
                  if (item.price && item.promo_price && item.price > item.promo_price) {
                    remiseGrid = Math.round(((item.price - item.promo_price) / item.price) * 100);
                  }
                  return (
                    <TouchableOpacity key={item.id} style={[styles.jumiaCard, { backgroundColor: isDarkMode ? '#1a1d21' : '#fff', borderColor: isDarkMode ? '#2d3139' : '#eee' }]} onPress={() => router.push(`/product/${item.id}`)}>
                      <View style={styles.imageContainer}>
                        <Image source={{ uri: item.image_url }} style={styles.jumiaProductImg} />
                        {remiseGrid > 0 && (
                          <View style={styles.jumiaPromoBadge}><Text style={styles.jumiaPromoBadgeText}>-{remiseGrid}%</Text></View>
                        )}
                      </View>
                      <View style={styles.jumiaInfoBlock}>
                        <Text style={[styles.jumiaProductTitle, { color: isDarkMode ? '#fff' : '#212529' }]} numberOfLines={2}>{item.title}</Text>
                        <Text style={styles.jumiaCurrentPrice}>{(item.promo_price || item.price).toLocaleString('fr-FR')} FCFA</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        ) : (
          <View style={{ marginBottom: 15 }}>
            <Text style={[styles.globalCatalogLabel, { color: isDarkMode ? '#fff' : '#212529' }]}>🔥 Grand Catalogue des Grossistes en Direct</Text>
            
            <View style={styles.jumiaGrid}>
              {products.map((item) => {
                let pourcentageRemise = 0;
                if (item.price && item.promo_price && item.price > item.promo_price) {
                  pourcentageRemise = Math.round(((item.price - item.promo_price) / item.price) * 100);
                }

                const stockMaximumSimule = 50;
                const pourcentageBarreStock = Math.min((item.stock_quantity / stockMaximumSimule) * 100, 100);
                let couleurBarre = '#2e7d32'; 
                if (item.stock_quantity <= 5) couleurBarre = '#d32f2f'; 
                else if (item.stock_quantity <= 15) couleurBarre = '#f57c00'; 

                return (
                  <TouchableOpacity key={item.id} style={[styles.jumiaCard, { backgroundColor: isDarkMode ? '#1a1d21' : '#fff', borderColor: isDarkMode ? '#2d3139' : '#eee' }]} onPress={() => router.push(`/product/${item.id}`)}>
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: item.image_url }} style={styles.jumiaProductImg} />
                      {pourcentageRemise > 0 && (
                        <View style={styles.jumiaPromoBadge}>
                          <Text style={styles.jumiaPromoBadgeText}>-{pourcentageRemise}%</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.jumiaInfoBlock}>
                      <Text style={[styles.jumiaProductTitle, { color: isDarkMode ? '#fff' : '#212529' }]} numberOfLines={2}>{item.title}</Text>
                      
                      {pourcentageRemise > 0 ? (
                        <View style={styles.jumiaPriceRow}>
                          <Text style={styles.jumiaCurrentPrice}>{item.promo_price?.toLocaleString('fr-FR')} FCFA</Text>
                          <Text style={styles.jumiaOldPrice}>{item.price.toLocaleString('fr-FR')} FCFA</Text>
                        </View>
                      ) : (
                        <Text style={styles.jumiaCurrentPrice}>{item.price.toLocaleString('fr-FR')} FCFA</Text>
                      )}

                      <View style={styles.stockSection}>
                        <Text style={[styles.stockCountText, { color: isDarkMode ? '#95a5a6' : '#555' }]}>⚡ {item.stock_quantity || 10} restants</Text>
                        <View style={[styles.progressBarBackground, { backgroundColor: isDarkMode ? '#111417' : '#e0e0e0' }]}>
                          <View style={[styles.progressBarFill, { width: `${pourcentageBarreStock}%`, backgroundColor: couleurBarre }]} />
                        </View>
                      </View>

                      <Text style={[styles.jumiaCategoryBadge, { backgroundColor: isDarkMode ? '#111417' : '#e9ecef', color: isDarkMode ? '#95a5a6' : '#495057' }]}>📦 {item.category}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

                         {renderProductRow("📱 Écrans Connectés", "phone", "#1072ba")}
            {renderProductRow("🔥 Offres Phares Jula", "iphone", "#f57c00")}
            {renderProductRow("💻 Parcs Informatiques", "ordinateur", "#1072ba")}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, gap: 12, paddingTop: 40 },
  searchField: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 25, paddingHorizontal: 16, gap: 10, height: 45 },
  searchInput: { flex: 1, fontSize: 14 },
  cartIconBtn: { padding: 4 },
  banner: { padding: 16, borderBottomWidth: 1 },
  bannerTitle: { fontSize: 18, fontWeight: 'bold', color: '#f57c00' },
  bannerSub: { fontSize: 11, color: '#6c757d', marginTop: 2 },
  topCategoriesScroll: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  topCatBadge: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 15, borderWidth: 1 },
  topCatText: { fontSize: 12 },
  globalCatalogLabel: { fontSize: 13, fontWeight: 'bold', marginHorizontal: 16, marginTop: 15, marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.5 },
  jumiaGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 5 },
  jumiaCard: { width: '48%', borderRadius: 8, marginBottom: 15, overflow: 'hidden', borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  imageContainer: { position: 'relative', width: '100%', height: 140, backgroundColor: '#f8f9fa' },
  jumiaProductImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  jumiaPromoBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#f57c00', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4, zIndex: 10 },
  jumiaPromoBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  jumiaInfoBlock: { padding: 10 },
  jumiaProductTitle: { fontSize: 13, fontWeight: '500', height: 36, lineHeight: 18, marginBottom: 4 },
  jumiaPriceRow: { marginVertical: 2 },
  jumiaCurrentPrice: { fontSize: 14, fontWeight: 'bold', color: '#f57c00' },
  jumiaOldPrice: { fontSize: 11, color: '#999', textDecorationLine: 'line-through', marginTop: 1 },
  stockSection: { marginVertical: 6 },
  stockCountText: { fontSize: 10, fontWeight: '600', marginBottom: 3 },
  progressBarBackground: { width: '100%', height: 5, borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },
  jumiaCategoryBadge: { fontSize: 9, paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4, alignSelf: 'flex-start', marginTop: 4 },
  sectionContainer: { marginTop: 15, paddingHorizontal: 16 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderTopLeftRadius: 6, borderTopRightRadius: 6, alignItems: 'center' },
  sectionTitle: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  seeAllText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  horizontalProductScroll: { paddingVertical: 10, gap: 10 },
  productCardHorizontal: { width: 110, borderRadius: 6, borderWidth: 1, overflow: 'hidden' },
  productImgHorizontal: { width: '100%', height: 85, resizeMode: 'cover' },
  miniPromoBadge: { position: 'absolute', top: 4, left: 4, backgroundColor: '#f57c00', paddingVertical: 1, paddingHorizontal: 4, borderRadius: 3, zIndex: 5 },
  miniPromoBadgeText: { color: '#fff', fontSize: 8, fontWeight: 'bold' },
  productInfoHorizontal: { padding: 6 },
  prodTitleHorizontal: { fontSize: 11, fontWeight: '500' },
  prodPriceHorizontal: { fontSize: 11, fontWeight: 'bold', color: '#f57c00', marginTop: 2 },
  searchResultsContainer: { paddingHorizontal: 16, marginTop: 15 },
  searchResultsTitle: { fontSize: 13, fontWeight: 'bold', marginBottom: 10, textTransform: 'uppercase' },
  noResultsTxt: { textAlign: 'center', color: '#7f8c8d', marginTop: 20 },
  
  /* 🎛️ COUCHE STYLES DE LA POP-UP MODALE FLASH */
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', center: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', maxWidth: 350, padding: 25, borderRadius: 16, borderWidth: 1, alignItems: 'center', position: 'relative' },
  closeAdButton: { position: 'absolute', top: -12, right: -12, backgroundColor: '#111417', borderRadius: 20, zIndex: 50 },
  modalAdBadge: { fontSize: 11, fontWeight: '800', letterSpacing: 1, marginBottom: 12, textAlign: 'center' },
  modalAdImage: { width: '100%', height: 180, borderRadius: 10, resizeMode: 'cover' },
  modalAdTitle: { fontSize: 15, fontWeight: 'bold', marginVertical: 15, textAlign: 'center', lineHeight: 20 },
  modalActionButton: { backgroundColor: '#f57c00', padding: 14, borderRadius: 8, width: '100%', alignItems: 'center' },
  modalActionButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 }
});
