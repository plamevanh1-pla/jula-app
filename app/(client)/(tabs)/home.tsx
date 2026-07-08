 import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image, ActivityIndicator, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../../src/config/supabaseClient';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [ad, setAd] = useState<any>(null);

  const topCategories = [
    { id: '1', title: '📱 Téléphones' },
    { id: '2', title: '💻 Informatique' },
    { id: '3', title: '🎮 Jeux Vidéo' },
    { id: '4', title: '🚗 Véhicules' },
    { id: '5', title: '⚽ Sport' },
    { id: '6', title: '🔌 Électronique' }
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

  const handleAdPress = () => {
    if (ad && ad.redirect_url) {
      Linking.openURL(ad.redirect_url).catch(err => console.error("Erreur:", err));
    }
  };

  const getProductsByCategory = (categoryKeyword: string) => {
    return products.filter(p => 
      p.category?.toLowerCase().includes(categoryKeyword.toLowerCase()) ||
      p.title?.toLowerCase().includes(categoryKeyword.toLowerCase())
    );
  };

  const searchedProducts = products.filter(p => 
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  const renderProductRow = (title: string, categoryKeyword: string, backgroundColor: string) => {
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
          {list.map((item) => (
            <TouchableOpacity key={item.id} style={styles.productCardHorizontal} onPress={() => router.push(`/product/${item.id}`)}>
              <Image 
                source={{ uri: item.image_url || 'https://unsplash.com' }} 
                style={styles.productImgHorizontal} 
              />
              <View style={styles.productInfoHorizontal}>
                <Text style={styles.prodTitleHorizontal} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.prodPriceHorizontal}>{item.price} FCFA</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBarContainer}>
        <View style={styles.searchField}>
          <Ionicons name="search-outline" size={20} color="#6c757d" />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Rechercher sur Jula..." 
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.cartIconBtn} onPress={() => router.push('/(client)/(tabs)/cart')}>
          <Ionicons name="cart-outline" size={24} color="#f57c00" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>🎉 Jula E-Commerce</Text>
          <Text style={styles.bannerSub}>Réseau interconnecté • 4 Pays de la Zone CFA</Text>
        </View>

        {ad && (
          <TouchableOpacity style={styles.adBannerContainer} onPress={handleAdPress}>
            <Image source={{ uri: ad.image_url }} style={styles.adBannerImage} />
            <View style={styles.adBannerBadge}><Text style={styles.adBannerBadgeText}>Sponsorisé</Text></View>
            <View style={styles.adBannerFooter}>
              <Text style={styles.adBannerTitle} numberOfLines={1}>{ad.title}</Text>
              <Text style={styles.adBannerAction}>Devenir Partenaire ➔</Text>
            </View>
          </TouchableOpacity>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.topCategoriesScroll}>
          {topCategories.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.topCatBadge} onPress={() => router.push('/(client)/categories')}>
              <Text style={styles.topCatText}>{cat.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {loading ? (
          <ActivityIndicator size="large" color="#f57c00" style={{ marginTop: 40 }} />
        ) : search.length > 0 ? (
          <View style={styles.searchResultsContainer}>
            <Text style={styles.searchResultsTitle}>Résultats ({searchedProducts.length})</Text>
            <View style={styles.gridContainer}>
              {searchedProducts.map(item => (
                <TouchableOpacity key={item.id} style={styles.gridCard} onPress={() => router.push(`/product/${item.id}`)}>
                  <Image source={{ uri: item.image_url || 'https://unsplash.com' }} style={styles.gridImg} />
                  <Text style={styles.gridTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.gridPrice}>{item.price} FCFA</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={{ marginBottom: 30 }}>
            {renderProductRow("📱 Smartphones & Tablettes", "phone", "#1072ba")}
            {renderProductRow("🔥 Offres Phares du Moment", "iphone", "#f57c00")}
            {renderProductRow("🎮 Jeux Vidéo & Consoles", "console", "#1072ba")}
            {renderProductRow("🚗 Véhicules & Camions", "voiture", "#212529")}
            {renderProductRow("⚽ Articles de Sport", "sport", "#00a86b")}
            {renderProductRow("💻 Matériels Informatiques", "ordinateur", "#1072ba")}
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
  banner: { backgroundColor: '#1072ba', margin: 16, marginBottom: 8, padding: 16, borderRadius: 10 },
  bannerTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  bannerSub: { color: '#fff', fontSize: 12, marginTop: 4, opacity: 0.95 },
  adBannerContainer: { margin: 16, marginTop: 8, borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  adBannerImage: { width: '100%', height: 130, resizeMode: 'cover' },
  adBannerBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  adBannerBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  adBannerFooter: { padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff' },
  adBannerTitle: { fontSize: 14, fontWeight: 'bold', color: '#1a1d20', flex: 1, marginRight: 10 },
  adBannerAction: { fontSize: 12, fontWeight: 'bold', color: '#f57c00' },
  topCategoriesScroll: { paddingHorizontal: 16, gap: 8, paddingVertical: 12 },
  topCatBadge: { backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#dee2e6' },
  topCatText: { fontSize: 12, fontWeight: 'bold', color: '#495057' },
  sectionContainer: { marginBottom: 14, backgroundColor: '#fff', paddingBottom: 10 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12 },
  sectionTitle: { color: '#fff', fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase' },
  seeAllText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  horizontalProductScroll: { paddingHorizontal: 14, gap: 12, paddingTop: 10 },
  productCardHorizontal: { backgroundColor: '#fff', width: 140, borderRadius: 6, overflow: 'hidden', borderWidth: 1, borderColor: '#f1f3f5' },
  productImgHorizontal: { width: '100%', height: 110, resizeMode: 'cover' },
  productInfoHorizontal: { padding: 8 },
  prodTitleHorizontal: { fontSize: 12, color: '#212529', fontWeight: '500' },
  prodPriceHorizontal: { fontSize: 13, color: '#f57c00', fontWeight: 'bold', marginTop: 4 },
  searchResultsContainer: { padding: 16 },
  searchResultsTitle: { fontSize: 15, fontWeight: 'bold', color: '#495057', marginBottom: 12 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridCard: { backgroundColor: '#fff', width: '48%', borderRadius: 8, padding: 8, borderWidth: 1, borderColor: '#e9ecef' },
  gridImg: { width: '100%', height: 140, borderRadius: 6, resizeMode: 'cover' },
  gridTitle: { fontSize: 13, fontWeight: '500', color: '#212529', marginTop: 8 },
  gridPrice: { fontSize: 14, fontWeight: 'bold', color: '#f57c00', marginTop: 4 }
});
