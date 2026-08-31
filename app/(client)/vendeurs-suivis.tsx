import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Initialisation rapide de Supabase (récupère tes clés automatiques)
const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL || "https://bgfmnjvhlonrfpfsxefe.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "sb_publishable_W_q0i6GH_dKXr2QFc3xu_Q_EUZzpDMK"
);

interface Vendeur {
  id: string;
  shop_name: string;
  full_name: string;
  phone: string;
  photo_boutique_url?: string;
}

export default function VendeursSuivisScreen() {
  const router = useRouter();
  const [vendeurs, setVendeurs] = useState<Vendeur[]>([]);
  const [loading, setLoading] = useState(true);

  // 📡 ASPIRATION DES VRAIS GROSSISTES RECUTÉS DANS TA BASE DE DONNÉES
  useEffect(() => {
    async function fetchVendeurs() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, shop_name, full_name, phone, photo_boutique_url')
          .eq('role', 'boutique'); // Filtre uniquement les vrais marchands !

        if (!error && data) {
          setVendeurs(data as Vendeur[]);
        }
      } catch (err) {
        console.error("Erreur chargement grossistes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchVendeurs();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête de la page */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>Vendeurs suivis</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#f57c00" />
        </View>
      ) : vendeurs.length === 0 ? (
        // Écran vide si aucun grossiste n'est encore dans ton Supabase
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>🏪</Text>
          <Text style={styles.emptyTitle}>Vous ne suivez aucun vendeur pour le moment</Text>
          <Text style={styles.emptySubtitle}>
            Les boutiques de vos grossistes favoris s'afficheront ici pour un accès rapide à leurs rayons.
          </Text>
          <TouchableOpacity style={styles.exploreButton} onPress={() => router.push('/')}>
            <Text style={styles.exploreButtonText}>Découvrir les boutiques</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // 🎛️ AFFICHAGE DES CARTES DES GROSSISTES RECRUTÉS (Adjame Test, etc.)
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionLabel}>Vos Grossistes Partenaires Jula ({vendeurs.length})</Text>
          
          {vendeurs.map((item) => (
            <View key={item.id} style={styles.card}>
              <Image 
                source={{ uri: item.photo_boutique_url || 'https://unsplash.com' }} 
                style={styles.shopImage} 
              />
              <View style={styles.infoBlock}>
                <Text style={styles.shopName}>{item.shop_name || 'Boutique Jula'}</Text>
                <Text style={styles.merchantName}>👤 Gérant : {item.full_name}</Text>
                <Text style={styles.phoneText}>📞 Tel : {item.phone || 'Non renseigné'}</Text>
                
                <View style={styles.badgeLine}>
                  <View style={styles.verifiedBadge}><Text style={styles.badgeText}>✓ Certifié Jula</Text></View>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.visitButton}
                onPress={() => router.push({ pathname: '/', params: { vendedor_id: item.id } })}
              >
                <Text style={styles.visitButtonText}>Visiter</Text>
              </TouchableOpacity>
            </View>
          ))}
          <View style={{ height: 30 }} />
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
  
  // Style Écran Vide Jumia
  emptyIcon: { fontSize: 60, marginBottom: 15 },
  emptyTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 8 },
  emptySubtitle: { fontSize: 12, color: '#777', textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  exploreButton: { backgroundColor: '#f57c00', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 6 },
  exploreButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  
  // Style des Cartes Grossistes en direct
  scrollContainer: { padding: 12 },
  sectionLabel: { fontSize: 12, color: '#666', fontWeight: 'bold', marginBottom: 12, textTransform: 'uppercase' },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  shopImage: { width: 65, height: 65, borderRadius: 6, backgroundColor: '#eee' },
  infoBlock: { flex: 1, paddingHorizontal: 12 },
  shopName: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  merchantName: { fontSize: 11, color: '#555', marginTop: 4 },
  phoneText: { fontSize: 11, color: '#777', marginTop: 2 },
  badgeLine: { flexDirection: 'row', marginTop: 6 },
  verifiedBadge: { backgroundColor: '#e8f5e9', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4 },
  badgeText: { color: '#2e7d32', fontSize: 10, fontWeight: 'bold' },
  visitButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#f57c00', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 4 },
  visitButtonText: { color: '#f57c00', fontWeight: 'bold', fontSize: 12 }
});
