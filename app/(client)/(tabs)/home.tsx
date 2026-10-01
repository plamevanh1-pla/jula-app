import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../../src/config/supabaseClient';

export default function HomeScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ad, setAd] = useState<any>(null);

  // 🎛️ ÉTATS DES FILTRES BUDGET AVANCÉS
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedCategoryKeyword, setSelectedCategoryKeyword] = useState<string>('');

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
    fetchProducts();
    fetchActiveAd();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setProducts(data);
    } catch (err: any) {
      console.log("Erreur produits Jula:", err.message);
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
      if (!error && data) setAd(data);
    } catch (err) {
      console.log("Pas de publicité active ou erreur:", err);
    }
  };

   // 🛑 SÉCURITÉ JULA : DÉSACTIVATION DU CLIC SORTANT SUR LA PUBLICITÉ
  const handleAdPress = () => {
    console.log("Publicité purement visuelle. Redirection bloquée par l'administrateur.");
  };

  // 🎛️ FILTRAGE INTERNE PAR CATÉGORIE ET PAR PRIX MAXIMAL
  const getProductsByCategory = (categoryKeyword: string) => {
    return products.filter(p => {
      const matchesCategory = p.category?.toLowerCase().includes(categoryKeyword.toLowerCase()) ||
                            p.title?.toLowerCase().includes(categoryKeyword.toLowerCase());
      
      const priceLimit = parseFloat(maxPrice);
      const matchesPrice = !isNaN(priceLimit) ? (p.promo_price || p.price) <= priceLimit : true;

      return matchesCategory && matchesPrice;
    });
  };

  // Moteur de recherche global + filtre de budget
  const searchedProducts = products.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase());
    
    const priceLimit = parseFloat(maxPrice);
    const matchesPrice = !isNaN(priceLimit) ? (p.promo_price || p.price) <= priceLimit : true;

    const matchesCategory = selectedCategoryKeyword !== '' ? (
      p.category?.toLowerCase().includes(selectedCategoryKeyword.toLowerCase()) ||
      p.title?.toLowerCase().includes(selectedCategoryKeyword.toLowerCase())
    ) : true;

    return matchesSearch && matchesPrice && matchesCategory;
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
              <TouchableOpacity key={item.id} style={styles.productCardHorizontal} onPress={() => router.push(`/product/${item.id}`)}>
                <View style={{ position: 'relative' }}>
                  <Image source={{ uri: item.image_url || 'https://unsplash.com' }} style={styles.productImgHorizontal} />
                  {remiseRow > 0 && (
                    <View style={styles.miniPromoBadge}><Text style={styles.miniPromoBadgeText}>-{remiseRow}%</Text></View>
                  )}
                </View>
                <View style={styles.productInfoHorizontal}>
                  <Text style={styles.prodTitleHorizontal} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.prodPriceHorizontal}>{(item.promo_price || item.price).toLocaleString('fr-FR')} F</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <View style={{ marginBottom: 15 }}>
            <Text style={styles.globalCatalogLabel}>🔥 Grand Catalogue des Grossistes en Direct</Text>
            
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
                  <TouchableOpacity key={item.id} style={styles.jumiaCard} onPress={() => router.push(`/product/${item.id}`)}>
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: item.image_url }} style={styles.jumiaProductImg} />
                      {pourcentageRemise > 0 && (
                        <View style={styles.jumiaPromoBadge}>
                          <Text style={styles.jumiaPromoBadgeText}>-{pourcentageRemise}%</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.jumiaInfoBlock}>
                      <Text style={styles.jumiaProductTitle} numberOfLines={2}>{item.title}</Text>
                      
                      {pourcentageRemise > 0 ? (
                        <View style={styles.jumiaPriceRow}>
                          <Text style={styles.jumiaCurrentPrice}>{item.promo_price?.toLocaleString('fr-FR')} FCFA</Text>
                          <Text style={styles.jumiaOldPrice}>{item.price.toLocaleString('fr-FR')} FCFA</Text>
                        </View>
                      ) : (
                        <Text style={styles.jumiaCurrentPrice}>{item.price.toLocaleString('fr-FR')} FCFA</Text>
                      )}

                      <View style={styles.stockSection}>
                        <Text style={styles.stockCountText}>⚡ {item.stock_quantity || 10} restants</Text>
                        <View style={styles.progressBarBackground}>
                          <View style={[styles.progressBarFill, { width: `${pourcentageBarreStock}%`, backgroundColor: couleurBarre }]} />
                        </View>
                      </View>

                      <Text style={styles.jumiaCategoryBadge}>📦 {item.category}</Text>
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
  container: { flex: 1, backgroundColor: '#f4f4f6' },
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#e9ecef', gap: 12, paddingTop: 40 },
  searchField: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f3f5', borderRadius: 25, paddingHorizontal: 16, gap: 10, height: 45 },
  searchInput: { flex: 1, fontSize: 14, color: '#212529' },
  cartIconBtn: { padding: 4 },
  filterBudgetBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderColor: '#e9ecef' },
  budgetInput: { backgroundColor: '#f1f3f5', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, width: 110, fontSize: 13, color: '#212529', fontWeight: 'bold', borderWidth: 1, borderColor: '#ced4da', height: 32 },
  banner: { backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  bannerTitle: { fontSize: 18, fontWeight: 'bold', color: '#f57c00' },
  bannerSub: { fontSize: 11, color: '#6c757d', marginTop: 2 },
  topCategoriesScroll: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', gap: 8 },
  topCatBadge: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 15, backgroundColor: '#f1f3f5', borderWidth: 1, borderColor: '#e9ecef' },
  topCatText: { fontSize: 12, color: '#495057' },
  globalCatalogLabel: { fontSize: 13, fontWeight: 'bold', color: '#212529', marginHorizontal: 16, marginTop: 15, marginBottom: 5, textTransform: 'uppercase', letterSpacing: 0.5 },
  jumiaGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 5 },
  jumiaCard: { width: '48%', backgroundColor: '#fff', borderRadius: 8, marginBottom: 15, overflow: 'hidden', borderWidth: 1, borderColor: '#eee', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  imageContainer: { position: 'relative', width: '100%', height: 140, backgroundColor: '#f8f9fa' },
  jumiaProductImg: { width: '100%', height: '100%', resizeMode: 'cover' },
  jumiaPromoBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#f57c00', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4, zIndex: 10 },
  jumiaPromoBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  jumiaInfoBlock: { padding: 10 },
  jumiaProductTitle: { fontSize: 13, fontWeight: '500', color: '#212529', height: 36, lineHeight: 18, marginBottom: 4 },
  jumiaPriceRow: { marginVertical: 2 },
  jumiaCurrentPrice: { fontSize: 14, fontWeight: 'bold', color: '#f57c00' },
  jumiaOldPrice: { fontSize: 11, color: '#999', textDecorationLine: 'line-through', marginTop: 1 },
  stockSection: { marginVertical: 6 },
  stockCountText: { fontSize: 10, fontWeight: '600', color: '#555', marginBottom: 3 },
  progressBarBackground: { width: '100%', height: 5, backgroundColor: '#e0e0e0', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3, backgroundColor: '#2e7d32' },
  jumiaCategoryBadge: { fontSize: 9, color: '#495057', backgroundColor: '#e9ecef', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4, alignSelf: 'flex-start', marginTop: 4 },
  adBannerContainer: { margin: 16, backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#eee' },
  adBannerImage: { width: '100%', height: 130, resizeMode: 'cover' },
  adBannerFooter: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, alignItems: 'center' },
  adBannerTitle: { fontSize: 13, fontWeight: 'bold', color: '#212529', flex: 1 },
  adBannerAction: { fontSize: 12, color: '#f57c00', fontWeight: 'bold' },
  sectionContainer: { marginTop: 15, paddingHorizontal: 16 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderTopLeftRadius: 6, borderTopRightRadius: 6, alignItems: 'center' },
  sectionTitle: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  seeAllText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  horizontalProductScroll: { paddingVertical: 10, gap: 10 },
  productCardHorizontal: { width: 110, backgroundColor: '#fff', borderRadius: 6, borderWidth: 1, borderColor: '#eee', overflow: 'hidden' },
  productImgHorizontal: { width: '100%', height: 85, resizeMode: 'cover' },
  miniPromoBadge: { position: 'absolute', top: 4, left: 4, backgroundColor: '#f57c00', paddingVertical: 1, paddingHorizontal: 4, borderRadius: 3, zIndex: 5 },
  miniPromoBadgeText: { color: '#fff', fontSize: 8, fontWeight: 'bold' },
  productInfoHorizontal: { padding: 6 },
  prodTitleHorizontal: { fontSize: 11, color: '#212529', fontWeight: '500' },
  prodPriceHorizontal: { fontSize: 11, fontWeight: 'bold', color: '#f57c00', marginTop: 2 },
  searchResultsContainer: { paddingHorizontal: 16, marginTop: 15 },
  searchResultsTitle: { fontSize: 13, fontWeight: 'bold', color: '#212529', marginBottom: 10, textTransform: 'uppercase' },
  noResultsTxt: { fontSize: 13, color: '#d32f2f', textAlign: 'center', marginTop: 20, fontWeight: '500' }
});