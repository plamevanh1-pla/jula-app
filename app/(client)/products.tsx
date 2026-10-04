import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';

export default function AdminProductsScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => { fetchAllProducts(); }, []);

  const fetchAllProducts = async () => {
    try {
      if (!supabase) return;
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) { 
      console.error("Erreur catalogue admin:", error.message); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleDeleteProduct = (id: number, name: string) => {
    Alert.alert("Modération", `Supprimer définitivement ${name || 'cet article'} ?`, [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: async () => {
        await supabase.from('products').delete().eq('id', id);
        fetchAllProducts();
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Barre d'en-tête officielle du QG */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.headerBarTitle}>MODÉRATION CATALOGUE</Text>
          <Text style={styles.headerBarSubtitle}>Gestion des smartphones et articles</Text>
        </View>
        <Feather name="box" size={20} color="#f57c00" />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#f57c00" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aucun article en vente sur Jula pour le moment.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image_url || 'https://unsplash.com' }} style={styles.img} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                {/* 🟢 RECTIFIÉ : Utilisation de item.title pour charger tes vrais smartphones */}
                <Text style={styles.name} numberOfLines={1}>{item.title || 'Produit Jula'}</Text>
                <Text style={styles.price}>{Number(item.price || 0).toLocaleString('fr-FR')} FCFA</Text>
                <Text style={styles.categoryBadge}>📦 {item.category || 'Général'}</Text>
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
  container: { flex: 1, backgroundColor: '#111417' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111417' },
  headerBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1a1d21', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#2d3139', paddingTop: 40 },
  backButton: { padding: 2 },
  headerBarTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', letterSpacing: 0.5 },
  headerBarSubtitle: { fontSize: 11, color: '#f57c00', fontWeight: '600', marginTop: 2 },
  
  list: { padding: 15 },
  emptyText: { textAlign: 'center', color: '#7f8c8d', marginTop: 40, fontSize: 13, fontWeight: '500' },
  card: { flexDirection: 'row', backgroundColor: '#1a1d21', padding: 12, borderRadius: 8, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: '#2d3139' },
  img: { width: 55, height: 55, borderRadius: 6, backgroundColor: '#111417', resizeMode: 'cover' },
  name: { fontSize: 14, fontWeight: 'bold', color: '#fff' },
  price: { color: '#f57c00', fontSize: 13, marginTop: 4, fontWeight: 'bold' },
  categoryBadge: { fontSize: 10, color: '#95a5a6', marginTop: 3 },
  delBtn: { backgroundColor: 'rgba(220, 53, 69, 0.15)', padding: 10, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }
});
