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
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) { console.error(error.message); } finally { setLoading(false); }
  };

  const handleDeleteProduct = (id: number, name: string) => {
    Alert.alert("Modération", `Supprimer définitivement ${name} ?`, [
      { text: "Annuler", style: "cancel" },
      { text: "Supprimer", style: "destructive", onPress: async () => {
        await supabase.from('products').delete().eq('id', id);
        fetchAllProducts();
      }}
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.backText}>⬅ Retour</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Modération Catalogue</Text>
        <View style={{ width: 60 }} />
      </View>
      {loading ? <ActivityIndicator size="large" color="#212529" style={{ marginTop: 40 }} /> : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image_url }} style={styles.img} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.price}>{item.price.toLocaleString()} FCFA</Text>
              </View>
              <TouchableOpacity style={styles.delBtn} onPress={() => handleDeleteProduct(item.id, item.name)}>
                <Text style={styles.delText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#212529' },
  backText: { color: '#fff', fontWeight: '500' }, headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  card: { flexDirection: 'row', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 12, alignItems: 'center', borderWidth: 1, borderColor: '#dee2e6' },
  img: { width: 50, height: 50, borderRadius: 6 }, name: { fontSize: 14, fontWeight: 'bold' }, price: { color: '#e65100', fontSize: 13, marginTop: 2 },
  delBtn: { backgroundColor: '#fee2e2', padding: 8, borderRadius: 6 }, delText: { color: '#dc3545', fontSize: 12, fontWeight: '600' }
});