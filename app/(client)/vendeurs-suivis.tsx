 import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// 🟢 IMPORTATION DE TON INSTANCE SUPABASE OFFICIELLE (CORRIGÉ POUR ÉVITER LES BUGS D'INITIALISATION)
import { supabase } from '../../src/config/supabaseClient';

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

  // 📡 ASPIRATION DES VRAIS GROSSISTES RECRUTÉS DANS TA BASE DE DONNÉES
  useEffect(() => {
    async function fetchVendeurs() {
      try {
        if (!supabase) return;
        const { data, error } = await supabase
          .from('profiles')
          .select('id, shop_name, full_name, phone, photo_boutique_url')
          .eq('role', 'boutique'); // Filtre uniquement les vrais grossistes / marchands !

        if (!error && data) {
          setVendeurs(data as Vendeur[]);
        }
      } catch (err) {
        console.error("Erreur chargement grossistes Jula:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchVendeurs();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête Premium Jula */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#212529" />
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>Vendeurs suivis</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#f57c00" />
        </View>
      ) : vendeurs.length === 0 ? (
        // Écran vide de secours si aucun grossiste n'est encore enregistré dans ton Supabase
        <View style={styles.center}>
          <Text style={styles.emptyIcon}>🏪</Text>
          <Text style={styles.emptyTitle}>Vous ne suivez aucun vendeur pour le moment</Text>
          <Text style={styles.emptySubtitle}>
            Les boutiques de vos grossistes favoris de la zone CFA s'afficheront ici pour un accès rapide à leurs rayons.
          </Text>
          <TouchableOpacity style={styles.exploreButton} onPress={() => router.replace('/(client)/(tabs)/home')}>
            <Text style={styles.exploreButtonText}>Découvrir les boutiques</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // 🎛️ RENDU VISUEL DES CARTES DE TES GROSSISTES EN DIRECT (Marchés d'Adjamé, Sandaga, etc.)
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
                <Text style={styles.merchantName}>👤 Gérant : {item.full_name || 'Grossiste Jula'}</Text>
                <Text style={styles.phoneText}>📞 Tel : {item.phone || 'Non renseigné'}</Text>
                
                <View style={styles.badgeLine}>
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.badgeText}>✓ Certifié Jula</Text>
                  </View>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.visitButton}
                onPress={() => router.push({ pathname: '/(client)/(tabs)/home', params: { vendedor_id: item.id } })}
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
  headerBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 15, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#e0e0e0', paddingTop: 40, gap: 12 },
  backButton: { padding: 2 },
  headerBarTitle: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 25 },
  
  // Style Écran Vide
  emptyIcon: { fontSize: 60, marginBottom: 15 },
  emptyTitle: { fontSize: 15, fontWeight: 'bold', color: '#212529', textAlign: 'center', marginBottom: 8 },
  emptySubtitle: { fontSize: 12, color: '#6c757d', textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  exploreButton: { backgroundColor: '#f57c00', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25 },
  exploreButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  
  // Style des Cartes Grossistes
  scrollContainer: { padding: 12 },
  sectionLabel: { fontSize: 12, color: '#6c757d', fontWeight: 'bold', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  shopImage: { width: 65, height: 65, borderRadius: 6, backgroundColor: '#f8f9fa' },
  infoBlock: { flex: 1, paddingHorizontal: 12 },
  shopName: { fontSize: 14, fontWeight: 'bold', color: '#212529' },
  merchantName: { fontSize: 12, color: '#495057', marginTop: 4 },
  phoneText: { fontSize: 11, color: '#7f8c8d', marginTop: 2 },
  badgeLine: { flexDirection: 'row', marginTop: 6 },
  verifiedBadge: { backgroundColor: '#e8f5e9', paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4 },
  badgeText: { color: '#2e7d32', fontSize: 10, fontWeight: 'bold' },
  visitButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#f57c00', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  visitButtonText: { color: '#f57c00', fontWeight: 'bold', fontSize: 12 }
});
