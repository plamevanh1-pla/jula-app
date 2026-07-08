import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image, ActivityIndicator, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../../src/config/supabaseClient';
import { Ionicons, FontAwesome } from '@expo/vector-icons';

export default function CartScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]); 
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

  useEffect(() => {
    fetchRecommendations();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase.from('profiles').select('country').eq('id', user.id).single()
          .then(({ data }) => { if (data?.country) setUserCountry(data.country); });
      }
    });
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*').limit(6);
      if (data && !error) setRecoProducts(data);
    } catch (err: any) { console.log(err.message); } finally { setLoading(false); }
  };

  const filteredProducts = recoProducts.filter(p => 
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

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

        {cartItems.length === 0 && (
          <View style={styles.emptyContainer}>
            <View style={styles.imageBox}>
              <Ionicons name="basket" size={80} color="#f57c00" />
              <View style={styles.orangeBadge}><Text style={styles.badgeText}>0</Text></View>
            </View>
            <Text style={styles.emptyTitle}>Votre panier est vide</Text>
            <TouchableOpacity style={styles.btnBrowse} onPress={() => router.push('/(client)/(tabs)/home')}><Text style={styles.btnBrowseText}>Parcourir les articles</Text></TouchableOpacity>
          </View>
        )}

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
                    <Text style={styles.recoPrice}>{item.price_fcfa} FCFA</Text>
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
              <TouchableOpacity onPress={() => { setMenuVisible(false); router.push('/(client)/(tabs)/home'); }}><Ionicons name="home" size={24} color="#f57c00" /></TouchableOpacity>
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
  emptyContainer: { backgroundColor: '#fff', alignItems: 'center', paddingVertical: 40, marginHorizontal: 16, borderRadius: 12, marginBottom: 20 },
  imageBox: { position: 'relative', width: 100, alignItems: 'center', justifyContent: 'center' },
  orangeBadge: { position: 'absolute', top: 5, right: 15, backgroundColor: '#f57c00', width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  emptyTitle: { fontSize: 16, fontWeight: 'bold', color: '#212529', marginTop: 15, marginBottom: 20 },
  btnBrowse: { backgroundColor: '#f57c00', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  btnBrowseText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  recoSection: { paddingHorizontal: 16, marginBottom: 30 },
  recoHeader: { fontSize: 16, fontWeight: 'bold', color: '#212529', marginBottom: 12 },
  recoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  recoCard: { backgroundColor: '#fff', width: '48%', borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e9ecef' },
  recoImg: { width: '100%', height: 120, resizeMode: 'contain', backgroundColor: '#f8f9fa' },
  recoInfo: { padding: 8 },
  recoTitle: { fontSize: 12, color: '#495057' },
  recoPrice: { fontSize: 13, fontWeight: 'bold', color: '#f57c00', marginTop: 4 },
  noResultTxt: { textAlign: 'center', color: '#7f8c8d', fontSize: 13, marginTop: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', flexDirection: 'row' },
  drawerContainer: { width: '75%', backgroundColor: '#fff', height: '100%', padding: 16, paddingTop: 45, justifyContent: 'space-between' },
  drawerHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#f1f3f5', paddingBottom: 14 },
  drawerBrand: { fontSize: 20, fontWeight: 'bold', color: '#f57c00' },
  drawerSectionTitle: { fontSize: 12, color: '#7f8c8d', fontWeight: 'bold', textTransform: 'uppercase', marginTop: 20, marginBottom: 10 },
  drawerItemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderColor: '#f8f9fa' },
  drawerFooter: { flexDirection: 'row', alignItems: 'center', gap: 8, borderTopWidth: 1, borderColor: '#f1f3f5', paddingTop: 14, paddingBottom: 10 }
});
