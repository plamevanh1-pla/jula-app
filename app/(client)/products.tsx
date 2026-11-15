import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';
import { useTheme } from '../../src/context/ThemeContext';

export default function AdminProductsScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isDarkMode } = useTheme();

  // Palette dynamique (Clair / Sombre)
  const themeColors = {
    bgMain: isDarkMode ? '#111417' : '#f4f6f9',
    bgCard: isDarkMode ? '#1a1d21' : '#ffffff',
    bgImg: isDarkMode ? '#111417' : '#f8f9fa',
    textMain: isDarkMode ? '#ffffff' : '#212529',
    textSub: isDarkMode ? '#95a5a6' : '#6c757d',
    border: isDarkMode ? '#2d3139' : '#e0e0e0',
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      console.error('Erreur catalogue admin:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = (id: string | number, name: string) => {
    Alert.alert('Modération', `Supprimer définitivement ${name || 'cet article'} ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          await supabase.from('products').delete().eq('id', id);
          fetchAllProducts();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.bgMain }]}>
      {/* Barre d'en-tête officielle du QG */}
      <View style={[styles.headerBar, { backgroundColor: themeColors.bgCard, borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={themeColors.textMain} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.headerBarTitle, { color: themeColors.textMain }]}>MODÉRATION CATALOGUE</Text>
          <Text style={styles.headerBarSubtitle}>Gestion des smartphones et articles</Text>
        </View>
        <Feather name="box" size={20} color="#f57c00" />
      </View>

      {loading ? (
        <View style={[styles.center, { backgroundColor: themeColors.bgMain }]}>
          <ActivityIndicator size="large" color="#f57c00" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucun article en vente sur Jula pour le moment.</Text>
          }
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: themeColors.bgCard, borderColor: themeColors.border }]}>
              <Image
                source={{ uri: item.image_url || 'https://placeholder.com' }}
                style={[styles.img, { backgroundColor: themeColors.bgImg }]}
              />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.name, { color: themeColors.textMain }]} numberOfLines={1}>
                  {item.title || 'Produit Jula'}
                </Text>
                <Text style={styles.price}>{Number(item.price || 0).toLocaleString('fr-FR')} FCFA</Text>
                <Text style={[styles.categoryBadge, { color: themeColors.textSub }]}>
                  📦 {item.category || 'Général'}
                </Text>
              </View>
              <TouchableOpacity style={styles.delBtn} onPress={() => handleDeleteProduct(item.id, item.title)}>
                <Feather name="trash-2" size={16} color="#dc3545" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerBar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, paddingTop: 40 },
  backButton: { padding: 2 },
  headerBarTitle: { fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
  headerBarSubtitle: { fontSize: 11, color: '#f57c00', fontWeight: '600', marginTop: 2 },
  list: { padding: 15 },
  emptyText: { textAlign: 'center', color: '#7f8c8d', marginTop: 40, fontSize: 13, fontWeight: '500' },
  card: { flexDirection: 'row', padding: 12, borderRadius: 8, marginBottom: 12, alignItems: 'center', borderWidth: 1 },
  img: { width: 55, height: 55, borderRadius: 6, resizeMode: 'cover' },
  name: { fontSize: 14, fontWeight: 'bold' },
  price: { color: '#f57c00', fontSize: 13, marginTop: 4, fontWeight: 'bold' },
  categoryBadge: { fontSize: 10, marginTop: 3 },
  delBtn: { backgroundColor: 'rgba(220, 53, 69, 0.15)', padding: 10, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }
});
