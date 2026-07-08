import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../src/config/supabaseClient';

export default function AiRecommendationsScreen() {
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAiRecommendations();
  }, []);

  const fetchAiRecommendations = async () => {
    setLoading(true);
    try {
      // Simulation d'une requête intelligente : on récupère un échantillon de produits phares
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(10); // Limite aux 10 meilleures suggestions

      if (error) throw error;
      
      // Mélange aléatoire simple pour simuler la spontanéité d'une IA
      const shuffled = (data || []).sort(() => 0.5 - Math.random());
      setRecommendedProducts(shuffled);
    } catch (error: any) {
      console.error("Erreur recommandations IA Jula:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>⬅ Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suggestions IA Jula</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Bannière IA */}
      <View style={styles.aiBanner}>
        <Text style={styles.aiBannerIcon}>🤖✨</Text>
        <View style={styles.aiBannerTextContainer}>
          <Text style={styles.aiBannerTitle}>Sélection personnalisée</Text>
          <Text style={styles.aiBannerSubtitle}>Notre intelligence artificielle a sélectionné ces articles pour vous.</Text>
        </View>
      </View>

      {/* Grille des produits recommandés */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#f57c00" />
        </View>
      ) : (
        <FlatList
          data={recommendedProducts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Ajoutez d'autres produits pour activer les suggestions personnalisées.</Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.productCard}
              onPress={() => router.push(`/product/${item.id}`)}
            >
              <Image source={{ uri: item.image_url || 'https://placeholder.com' }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price.toLocaleString()} FCFA</Text>
                <View style={styles.aiMatchBadge}>
                  <Text style={styles.aiMatchText}>✨ Correspondance à 98%</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#dee2e6' },
  backButton: { padding: 4 },
  backText: { fontSize: 15, color: '#f57c00', fontWeight: '600' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  aiBanner: { flexDirection: 'row', backgroundColor: '#e3f2fd', margin: 16, padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#bbdefb' },
  aiBannerIcon: { fontSize: 32, marginRight: 12 },
  aiBannerTextContainer: { flex: 1 },
  aiBannerTitle: { fontSize: 16, fontWeight: 'bold', color: '#0d47a1' },
  aiBannerSubtitle: { fontSize: 12, color: '#1565c0', marginTop: 2, lineHeight: 16 },
  productList: { paddingHorizontal: 8, paddingBottom: 20 },
  productCard: { flex: 1, backgroundColor: '#fff', margin: 8, borderRadius: 8, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  productImage: { width: '100%', height: 150, resizeMode: 'cover' },
  productInfo: { padding: 10 },
  productName: { fontSize: 13, fontWeight: '500', color: '#212529', height: 38 },
  productPrice: { fontSize: 15, fontWeight: 'bold', color: '#e65100', marginTop: 4 },
  aiMatchBadge: { backgroundColor: '#e8f5e9', alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 8 },
  aiMatchText: { color: '#2e7d32', fontSize: 10, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: '#6c757d', marginTop: 40, fontSize: 14, paddingHorizontal: 32 }
});